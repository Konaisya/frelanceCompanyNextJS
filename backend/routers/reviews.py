from fastapi import APIRouter, Depends, HTTPException, Query
from utils.enums import Status, OrderStatus
from dependencies import *
from utils.enums import *
from schemas.reviews import *
from datetime import datetime, date
from utils.to_dict import to_dict

router = APIRouter()

@router.post('/', status_code=201)
async def create_reviews(new_review: CreateReview,
                         review_service: ReviewService = Depends(get_review_service),
                         order_service: OrderService = Depends(get_order_service),
                         current_user: User = Depends(get_current_user)
                         ):
    new_review_dict = new_review.model_dump()
    new_review_dict['id_user_author'] = current_user.id

    order = order_service.get_one_order_filter_by(id=new_review_dict['id_order'])
    if not order or order.id_user_executor != new_review_dict['id_user_target'] or order.status != OrderStatus.COMPLETED.value:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value, 'message': 'Invalid order or target user'})
    
    created_review = review_service.create_review(new_review_dict)
    if not created_review:
        raise HTTPException(status_code=400, detail={'status': Status.FAILED.value})
    return created_review
    
@router.get('/', status_code=200)
async def get_all_reviews(id_user_author: int | None = Query(None),
                          id_user_target: int | None = Query(None),
                          rating: int | None = Query(None),
                          comment: str | None = Query(None),
                          created_at: datetime | None = Query(None),
                          updated_at: datetime | None = Query(None),
                          review_service: ReviewService = Depends(get_review_service),
                          user_service: UserService = Depends(get_user_service),
                          order_service: OrderService = Depends(get_order_service)
                          ):
    filter = {k: v for k, v in locals().items() if v is not None and k not in 
              {'review_service', 'user_service', 'order_service'}}

    reviews = review_service.get_all_reviews_filter_by(**filter)
    if not reviews:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    
    response = []
    for review in reviews:
        order = order_service.get_one_order_filter_by(id=review.id_order)
        order_response = ShortOrderResponse(**to_dict(order))

        user_author = user_service.get_user_filter_by(id=review.id_user_author)
        author_response = UserResponse(**to_dict(user_author))

        user_target = user_service.get_user_filter_by(id=review.id_user_target)
        target_response = UserResponse(**to_dict(user_target))

        review_dict = to_dict(review)
        review_dict['user_author'] = author_response
        review_dict['user_target'] = target_response
        review_dict['order'] = order_response
        response.append(ReviewResponse(**review_dict))
    
    return response

@router.get('/{id}', status_code=200)
async def get_one_review(id: int,
                         review_service: ReviewService = Depends(get_review_service),
                         user_service: UserService = Depends(get_user_service),
                         order_service: OrderService = Depends(get_order_service)
                         ):
    review = review_service.get_one_review_filter_by(id=id)
    if not review:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    
    order = order_service.get_one_order_filter_by(id=review.id_order)
    order_response = ShortOrderResponse(**to_dict(order))

    user_author = user_service.get_user_filter_by(id=review.id_user_author)
    author_response = UserResponse(**to_dict(user_author))

    user_target = user_service.get_user_filter_by(id=review.id_user_target)
    target_response = UserResponse(**to_dict(user_target))

    review_dict = to_dict(review)
    review_dict['user_author'] = author_response
    review_dict['user_target'] = target_response
    review_dict['order'] = order_response
    return ReviewResponse(**review_dict)

@router.put('/{id}', status_code=200)
async def update_review(id: int,
                        upd_review: UpdateReview,
                        review_service: ReviewService = Depends(get_review_service),
                        ):
    review = review_service.get_one_review_filter_by(id=id)
    if not review:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    upd_review_dict = upd_review.model_dump()
    upd_review_dict['updated_at'] = datetime.now()
    updated_review = review_service.update_review(id=id, entity=upd_review_dict)
    return updated_review

@router.delete('/{id}', status_code=200)
async def delete_review(id: int,
                        review_service: ReviewService = Depends(get_review_service),
                        ):
    review = review_service.get_one_review_filter_by(id=id)
    if not review:
        raise HTTPException(status_code=404, detail={'status': Status.NOT_FOUND.value})
    deleted_review = review_service.delete_review(id=id)
    return Status.SUCCESS.value