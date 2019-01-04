import _ from "lodash"
import React, { Component } from "react"
import { Card, Grid, Table } from "semantic-ui-react"
import TableBody from "./TableBody"
import TableHeader from "./TableHeader"
import TableLimiter from "./TableLimiter"
import TablePagination from "./TablePagination"
import TableSearch from "./TableSearch"

interface IProps {
  data: any[]
  fields: IField[]
  onRowClick: (rowData: any) => void
}

interface IState {
  activePage: number
  itemPerPage: number
  searchValue: string
  searchKey: string
  sortKey: string
  isDescending: boolean
}

export default class CustomTable extends Component<IProps, IState> {
  public state: IState = {
    activePage: 1,
    itemPerPage: 1,
    searchValue: "",
    searchKey: this.props.fields[0].name,
    sortKey: this.props.fields[0].name,
    isDescending: false,
  }

  public changeSearchValue(value: string) {
    this.setState({ searchValue: value, activePage: 1 })
  }

  public changeSearchKey(key: string) {
    this.setState({ searchKey: key, activePage: 1 })
  }

  public changeSort(fieldName: string) {
    this.setState((prevState) => ({
      sortKey: fieldName,
      isDescending: !prevState.isDescending,
      activePage: 1,
    }))
  }

  public changePage(page: number) {
    this.setState({ activePage: page })
  }

  public changeLimit(limit: number) {
    this.setState({ itemPerPage: limit, activePage: 1 })
  }

  public getFilteredData() {
    return this.props.data.filter((item) => {
      const currentItem = (item[this.state.searchKey] as string).toLowerCase()
      const searchValue = this.state.searchValue.toLowerCase()
      return currentItem.search(searchValue) > -1
    })
  }

  public getSortedData() {
    const sortedData = _.sortBy(this.getFilteredData(), this.state.sortKey)
    return this.state.isDescending ? sortedData.reverse() : sortedData
  }

  public getPaginatedData() {
    const offset = this.getOffset()
    const end = offset + this.state.itemPerPage
    return this.getSortedData().slice(offset, end)
  }

  public getOffset() {
    return (this.state.activePage - 1) * this.state.itemPerPage
  }

  public render() {
    return (
      <Card fluid>
        <Card.Content>
          <Grid columns="2">
            <Grid.Column>
              <TableSearch
                searchValue={this.state.searchValue}
                searchKey={this.state.searchKey}
                fields={this.props.fields}
                onChangeSearchValue={(value) => this.changeSearchValue(value)}
                onChangeSearchKey={(key) => this.changeSearchKey(key)}
              />
            </Grid.Column>
            <Grid.Column textAlign="right">
              <TableLimiter onChange={(limit) => this.changeLimit(limit)} />
            </Grid.Column>
          </Grid>

          <Table celled sortable selectable>
            <TableHeader
              fields={this.props.fields}
              sortKey={this.state.sortKey}
              isDescending={this.state.isDescending}
              onChangeSort={(fieldName) => this.changeSort(fieldName)}
            />
            <TableBody
              fields={this.props.fields}
              data={this.getPaginatedData()}
              startingNumber={this.getOffset() + 1}
              onRowClick={(rowData) => this.props.onRowClick(rowData)}
            />
            <Table.Footer>
              <Table.Row>
                <TablePagination
                  dataLength={this.getFilteredData().length}
                  itemPerPage={this.state.itemPerPage}
                  activePage={this.state.activePage}
                  onPageChange={(pageNumber) => this.changePage(pageNumber)}
                />
              </Table.Row>
            </Table.Footer>
          </Table>
        </Card.Content>
      </Card>
    )
  }
}