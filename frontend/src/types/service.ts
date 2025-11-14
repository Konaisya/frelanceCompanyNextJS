import { Executor } from "./executor"
import { Specialization } from "./specialization"


export interface Service {
  id: number
  name: string
  description: string
  specialization: Specialization
  user_executor: Executor
  price: number
  delivery_time: number
}
