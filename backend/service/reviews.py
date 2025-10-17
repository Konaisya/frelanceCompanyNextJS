from schemas.reviews import *
from crud.reviews import *

class ReviewService:
    def __init__(self, review_repository: ReviewRepository):
        self.review_repository = review_repository

    def get_all_reviews_filter_by(self, **filter):
        return self.review_repository.get_all_filter_by(**filter)
    
    def get_one_review_filter_by(self, **filter):
        return self.review_repository.get_one_filter_by(**filter)
    
    def create_review(self, data: dict):
        return self.review_repository.add(data)
    
    def update_review(self, id: int, entity: dict):
        entity['id'] = id
        entity = {k: v for k, v in entity.items() if v is not None}
        return self.review_repository.update(entity)

    def delete_review(self, id: int):
        return self.review_repository.delete(id)