import React from 'react'
import { Mutation } from 'react-apollo'; 
import gql from 'graphql-tag';
import {ALL_ITEMS_QUERY} from './Items';

const DELETE_ITEM_MUTATION = gql`
	mutation DELETE_ITEM_MUTATION($id: ID!) {
		deleteItem(id: $id) {
			id
		}
	}
`;

class DeleteItem extends React.Component {
	update = (cache, payload) => {
		// apollo provides the cache and payload
		//manually update the cache on the client, so it matches the server
		//1. Read the cache for the items we want we need to do this through a graphql query
		const data = cache.readQuery({query: ALL_ITEMS_QUERY});
		//2. Filter the deleted item out of the page
		data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
		//3. Put the items back!
		cache.writeQuery({query: ALL_ITEMS_QUERY, data});
	}
	render() {
		return (
			<Mutation
				mutation={DELETE_ITEM_MUTATION}
				variables={{id: this.props.id}}
				update={this.update}
			>
				{(deleteItem, {error}) => (
					<button onClick={()=>{if(confirm('Are you sure you want to delete this?')){
						deleteItem();
					}}}>
						{this.props.children}
					</button>
				)}
			</Mutation>
		)
	}
}

export default DeleteItem; 