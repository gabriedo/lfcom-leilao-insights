from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from backend.routers import pre_analysis
from backend.routers.pre_analysis import extract_basic_data_from_html

app = FastAPI()

app.include_router(pre_analysis.router)

@app.post("/pre-analyze")
async def pre_analyze_endpoint(request: Request):
    data = await request.json()
    url = data.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")

    import httpx
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            html = response.text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch the URL: {str(e)}")

    extracted_data = extract_basic_data_from_html(html, url)

    return JSONResponse(content=extracted_data)

# Exemplo de teste via terminal:
# curl -X POST http://localhost:8080/pre-analyze \
#   -H "Content-Type: application/json" \
#   -d '{"url": "https://www.portalzuk.com.br/imovel/pr/curitiba/xaxim/rua-cristiano-strobel-912/32897-201775"}'