from fastapi import FastAPI, UploadFile, File
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store uploaded data temporarily
GLOBAL_DF = None

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    global GLOBAL_DF
    df = pd.read_csv(file.file)
    GLOBAL_DF = df
    return {"rows": len(df), "columns": list(df.columns)}

@app.get("/data")
def get_data(page: int = 1, page_size: int = 20):
    global GLOBAL_DF
    if GLOBAL_DF is None:
        return {"error": "No file uploaded"}

    start = (page - 1) * page_size
    end = start + page_size
    data = GLOBAL_DF.iloc[start:end].to_dict(orient="records")

    return {
        "page": page,
        "page_size": page_size,
        "total_rows": len(GLOBAL_DF),
        "data": data
    }
