
export interface CreateMailItemRequest {
  itemId: string
  title: string
  content: string
  mailDestination: string
  sendDate: string
  sendWithAttachment: boolean
}
