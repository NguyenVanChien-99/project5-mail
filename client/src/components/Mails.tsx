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
  Loader
} from 'semantic-ui-react'

import { createTodo, deleteTodo, getAllMail, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { MailItem } from '../types/Mail'

interface MailsProps {
  auth: Auth
  history: History
}

interface MailsState {
  mails: MailItem[]
  loadingMails: boolean
}

export class Mails extends React.PureComponent<MailsProps, MailsState> {
  state: MailsState = {
    mails: [],
    loadingMails: true
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
        <Header as="h1">TODOs</Header>

        {this.renderCreateTodoInput()}

        {this.renderTodos()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: ()=>{}
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={()=>{}}
          />
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
        {this.state.mails.map((mail, pos) => {
          return (
            <Grid.Row key={mail.itemId}>
              
              <Grid.Column width={10} verticalAlign="middle">
                {mail.title}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {mail.content}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(mail.itemId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => {}}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {mail.attachmentUrl && (
                <Image src={mail.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
