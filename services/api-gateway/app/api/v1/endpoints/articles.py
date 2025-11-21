from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.article_response import ArticleResponse
from app.models import Article

router = APIRouter(prefix="/articles")

@router.get("/", response_model=list[ArticleResponse])
def get_articles(db: Session = Depends(get_db)):
    return db.query(Article).all()

@router.get("/{article_id}", response_model=ArticleResponse)
def get_article(article_id: int, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail=f"Article with id {article_id} not found")
    return article