from app.schemas.articles import ArticleCreate
from app.models.articles import ArticleDB

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError


class DatabaseService:
    def save_articles(self, articles: list[ArticleCreate], db: Session):
        """
        Allows to save scraped articles in database

        :param self: Description
        :param articles: Description
        :type articles: list[ArticleCreate]
        :param db: Description
        :type db: Session
        """

        saved_count = 0
        skipped_count = 0

        urls_to_check = [str(article.url) for article in articles]
        existing_article_records = {
            record.url
            for record in db.query(ArticleDB)
            .filter(ArticleDB.url.in_(urls_to_check))
            .all()
        }

        for article in articles:
            if str(article.url) in existing_article_records:
                skipped_count += 1
                continue

            article_data = article.model_dump(mode="json", exclude_none=True)
            article_db = ArticleDB(**article_data)
            db.add(article_db)
            saved_count += 1

        try:
            db.commit()
            status = "SUCCESS"
        except IntegrityError:
            db.rollback()
            status = "FAIL"
            raise RuntimeError("Database error during bulk save")

        return {
            "status": status,
            "total_scraped": len(articles),
            "new_saved": saved_count,
            "skipped_duplicates": skipped_count,
        }


db_service = DatabaseService()
