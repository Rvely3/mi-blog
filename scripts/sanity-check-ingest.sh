#!/usr/bin/env bash
# Sanity check del endpoint /api/ingest-post.
# Cubre: método no permitido, auth, body malformado, recordId inválido.
# NO toca Airtable ni Sanity: los 6 casos cortan antes de eso.
#
# Uso:
#   1. Tener `npm run dev` corriendo en otra terminal.
#   2. Exportar el secret del .env.local:
#        export INGEST_API_SECRET="el-valor-real-de-tu-env"
#   3. Ejecutar: bash scripts/sanity-check-ingest.sh
#
# Esperado (exit 0 si todos coinciden):
#   1. GET                              → 405
#   2. POST sin Authorization           → 401 (msg: "Falta Authorization: Bearer")
#   3. POST con Bearer incorrecto       → 401 (msg: "Token inválido") + log dev con sample
#   4. POST + JSON malformado           → 400 (msg: "JSON inválido")
#   5. POST + body vacío {}             → 400 (msg: "Payload inválido" + issues Zod)
#   6. POST + recordId mal formado      → 400 (msg: "Payload inválido" + issue regex)

set -u

URL="${URL:-http://localhost:3000/api/ingest-post}"
SECRET="${INGEST_API_SECRET:-}"

if [ -z "$SECRET" ]; then
  echo "ERROR: exportá INGEST_API_SECRET antes de correr este script."
  echo "Ejemplo: export INGEST_API_SECRET=\"\$(grep ^INGEST_API_SECRET .env.local | cut -d= -f2-)\""
  exit 2
fi

pass=0
fail=0

assert_code() {
  local name="$1" expected="$2" actual="$3" body="$4"
  if [ "$actual" = "$expected" ]; then
    echo "  ✓ $name → $actual"
    pass=$((pass+1))
  else
    echo "  ✗ $name → esperado $expected, recibido $actual"
    echo "    body: $body"
    fail=$((fail+1))
  fi
}

run() {
  local name="$1" expected="$2"; shift 2
  local body status
  body=$(curl -sS -o /tmp/_sc_body -w "%{http_code}" "$@" "$URL")
  status="$body"
  body=$(cat /tmp/_sc_body)
  assert_code "$name" "$expected" "$status" "$body"
}

echo "== Sanity check /api/ingest-post =="
echo

echo "1. GET (método no permitido)"
run "GET → 405" 405 -X GET

echo "2. POST sin Authorization"
run "POST sin auth → 401" 401 -X POST -H "Content-Type: application/json" -d '{}'

echo "3. POST con Bearer incorrecto"
run "POST Bearer malo → 401" 401 \
  -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer definitely-not-the-real-token" \
  -d '{}'

echo "4. POST + JSON malformado"
run "POST JSON roto → 400" 400 \
  -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SECRET" \
  -d 'not-json{'

echo "5. POST + body vacío {}"
run "POST body vacío → 400" 400 \
  -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SECRET" \
  -d '{}'

echo "6. POST + recordId mal formado"
run "POST recordId inválido → 400" 400 \
  -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SECRET" \
  -d '{"recordId":"no-es-un-id"}'

echo
echo "== Resultado: $pass OK, $fail fallos =="
rm -f /tmp/_sc_body
[ "$fail" -eq 0 ]
