import React, { Component, Fragment } from "react"
import { Button } from "semantic-ui-react"
import Form from "./Form"
import Table from "./Table"

interface IProps<T> {
  data: T[]
  fields: IField[]
  onCreate: (input: T) => void
  onUpdate: (input: T) => void
  onDelete: (input: T) => void
}

interface IState {
  open: boolean
  selectedData: any
}

export default class DataTable<T> extends Component<IProps<T>, IState> {
  public state: IState = {
    open: false,
    selectedData: {},
  }

  public openForm(selectedData: any) {
    this.setState({ open: true, selectedData })
  }

  public closeForm() {
    this.setState({ open: false })
  }

  public filterFields() {
    return this.props.fields.filter((field) => !field.hide)
  }

  public render() {
    return (
      <Fragment>
        <Button
          content="Tambah"
          color="green"
          onClick={() => this.openForm({})}
        />
        <Form
          open={this.state.open}
          fields={this.props.fields}
          initialInput={this.state.selectedData}
          onCreate={(input) => this.props.onCreate(input)}
          onUpdate={(input) => this.props.onUpdate(input)}
          onDelete={(input) => this.props.onDelete(input)}
          onClose={() => this.closeForm()}
        />
        <Table
          data={this.props.data}
          fields={this.filterFields()}
          onRowClick={(rowData: any) => this.openForm(rowData)}
        />
      </Fragment>
    )
  }
}
