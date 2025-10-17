from schemas.transactions import *
from crud.transactions import *

class TransactionService:
    def __init__(self, transaction_repository: TransactionRepository):
        self.transaction_repository = transaction_repository

    def get_all_transactions_filter_by(self, **filter):
        return self.transaction_repository.get_all_filter_by(**filter)

    def get_one_transaction_filter_by(self, **filter):
        return self.transaction_repository.get_one_filter_by(**filter)

    def create_transaction(self, new_transaction: dict):
        return self.transaction_repository.add(new_transaction)

