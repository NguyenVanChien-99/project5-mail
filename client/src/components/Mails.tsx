import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Segment,
  Modal,
  Form,
  TextArea
} from 'semantic-ui-react'

import { createTodo, deleteTodo, getAllMail, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { MailItem } from '../types/Mail'

interface MailsProps {
  auth: Auth
  history: History
}

interface MailCreate {
  title: string
  content: string
  sendDate: string
  mailReceive: string
  sendWithAttachment: boolean
  file?: any
}

interface MailsState {
  mails: MailItem[]
  loadingMails: boolean
  showModal: boolean
  mailCreate: MailCreate
}

export class Mails extends React.PureComponent<MailsProps, MailsState> {
  state: MailsState = {
    mails: [],
    loadingMails: true,
    showModal: false,
    mailCreate:{
      content:"",
      mailReceive:"",
      sendDate:"",
      sendWithAttachment:false,
      title:""
    }
  }


  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  // onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
  //   try {
  //     const dueDate = this.calculateDueDate()
  //     const newTodo = await createTodo(this.props.auth.getIdToken(), {
  //       name: this.state.newTodoName,
  //       dueDate
  //     })
  //     this.setState({
  //       todos: [...this.state.todos, newTodo],
  //       newTodoName: ''
  //     })
  //   } catch {
  //     alert('Todo creation failed')
  //   }
  // }

  // onTodoDelete = async (todoId: string) => {
  //   try {
  //     await deleteTodo(this.props.auth.getIdToken(), todoId)
  //     this.setState({
  //       todos: this.state.todos.filter(todo => todo.todoId !== todoId)
  //     })
  //   } catch {
  //     alert('Todo deletion failed')
  //   }
  // }

  // onTodoCheck = async (pos: number) => {
  //   try {
  //     const todo = this.state.todos[pos]
  //     await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
  //       name: todo.name,
  //       dueDate: todo.dueDate,
  //       done: !todo.done
  //     })
  //     this.setState({
  //       todos: update(this.state.todos, {
  //         [pos]: { done: { $set: !todo.done } }
  //       })
  //     })
  //   } catch {
  //     alert('Todo deletion failed')
  //   }
  // }

  async componentDidMount() {
    try {
      const mails = await getAllMail(this.props.auth.getIdToken())
      this.setState({
        mails,
        loadingMails: false
      })
    } catch (e) {
      alert(`Failed to fetch mails: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Mail-Send a message for the future</Header>

        {this.renderCreateTodoInput()}
        {this.renderModalCreate()}
        {this.renderTodos()}
      </div>
    )
  }


  renderModalCreate() {
    return (
      <Modal
        onClose={() => this.setState({
          mails: this.state.mails,
          loadingMails: this.state.loadingMails,
          showModal: false
        })}
        onOpen={() => this.setState({
          mails: this.state.mails,
          loadingMails: this.state.loadingMails,
          showModal: true
        })}
        open={this.state.showModal}
      >
        <Modal.Header>Create new Mail Item</Modal.Header>
        <Modal.Content as={Form}>
          <Form onSubmit={() => {
            //TODO: add 

          }}>
            <Form.Field>
              <label>Title</label>
              <input placeholder='Title' value={this.state.mailCreate.title}
                onChange={(e)=>{
                    console.log(e)
                }}
              />
            </Form.Field>
            <Form.Field>
              <label>To Email</label>
              <input placeholder='Choose destination email...' />
            </Form.Field>
            <Form.Field
              control={TextArea}
              label='Message'
              placeholder='Message for the future'
            />
            <Form.Field>
              <label>Date and Time expected</label>
              <input placeholder='yyyy-MM-ddThh:mm:ss' />
            </Form.Field>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={()=>{

              }}
            />
            <Form.Button type='submit'
              icon='checkmark'
              positive>Create
            </Form.Button>
            <span>*Note 1: When you put the new email, please help me verify it (aws will send you an email). Because this account is under SandBox. More infomation <a href='https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html'>SandBox</a></span>
            <br/>
            <span>*Note 2: Mail will be send for 5 minutes late</span>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Button primary icon='add' onClick={() => {
            this.setState({
              mails: this.state.mails,
              loadingMails: this.state.loadingMails,
              showModal: true
            })
          }}>Add new mail message here !</Button>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingMails) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        <Grid.Row divided>

          <Grid.Column width={4} verticalAlign="middle">
            <strong>Title</strong>
          </Grid.Column>
          <Grid.Column width={9} floated="right">
            Content
          </Grid.Column>
          <Grid.Column width={2} floated="right">
            Action
          </Grid.Column>
        </Grid.Row>
        <Divider section />
        {this.state.mails.map((mail, pos) => {
          return (
            <>
              <Grid.Row key={mail.itemId} divided>

                <Grid.Column width={4} verticalAlign="middle">
                  <strong>{mail.title}</strong>
                  <br />
                  To : {mail.mailDestination}
                  <br />
                  Date expected : {mail.sendDate.replaceAll("Z", "")}
                </Grid.Column>
                <Grid.Column width={9} floated="right">
                  {mail.content}
                </Grid.Column>
                <Grid.Column width={2} floated="right">
                  <Button
                    icon
                    color="blue"
                    onClick={() => this.onEditButtonClick(mail.itemId)}
                  >
                    <Icon name="pencil" />
                  </Button>
                  <Button
                    icon
                    color="red"
                    onClick={() => { }}
                  >
                    <Icon name="delete" />
                  </Button>
                </Grid.Column>
                {this.showAttachment(mail.sendWithAttachment, mail.attachmentUrl)}
              </Grid.Row>
              <Divider section />
            </>
          )
        })}
      </Grid>
    )
  }

  showAttachment(attachment: boolean, attachmentUrl: string) {
    if (!attachment || !attachmentUrl) {
      return <></>
    }
    const splited = attachmentUrl.split(".");
    const extension = splited[splited.length - 1];
    console.log(extension)
    if (extension === "jpg" || extension === "jpeg" || extension === "png") {
      return <Image src={attachmentUrl} size="small" wrapped />
    }
    return <Segment>
      <strong>Attachment URL: </strong> <a href={attachmentUrl}>{attachmentUrl}</a>
    </Segment>
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
