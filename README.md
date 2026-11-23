## 3. Backend starten (Terminal 1)

    conda activate passanten
    cd backend
    python -m uvicorn main:app --reload

- Spec: http://localhost:8000/api/spec
- Daten: http://localhost:8000/api/data?location=Lintheschergasse
- API-Doku: http://localhost:8000/docs

## 4. Frontend starten (Terminal 2)
Voraussetzung: Node.js installiert.

    cd frontend
    npm install
    npm run dev

App: http://localhost:5173
Im Network-Tab der DevTools sieht man: `/api/spec` einmal, `/api/data` bei jedem Wechsel.
