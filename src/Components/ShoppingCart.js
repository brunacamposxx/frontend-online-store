import React from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/api';
import CardList from './CardList';

class ShoppingCart extends React.Component {
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);

    this.state = {
      lista: [],
      products: [],
      search: '',
    };
  }

  componentDidMount() {
    this.fetchCategories();
  }

  onClick({ target }) {
    const { id, name } = target;
    this.setState({
      [name]: id,
    });
    const { search } = this.state;
    this.fetchItems(id, search);
  }

   fetchCategories = async () => {
     await api.getCategories().then((result) => {
       this.setState({ lista: result });
     });
   }

  fetchItems = async (categoryId = '', search) => {
    await api.getProductsFromCategoryAndQuery(categoryId, search).then((result) => {
      this.setState({ products: result.results });
    });
  }

  renderCategorys = () => {
    const { lista } = this.state;
    return lista.map((element) => (
      <li key={ element.id }>
        <button
          data-testid="category"
          type="button"
          id={ element.id }
          name={ element.name }
          onClick={ this.onClick }
        >
          { element.name }
        </button>
      </li>
    ));
  }

  renderProducts = () => {
    const { products } = this.state;
    // if (products.length < 1) {
    //   return <p> Nenhum produto foi encontrado </p>;
    // }
    return products.map((product) => <CardList key={ product.id } product={ product } />);
  }

  filterInput = async () => {
    const { search } = this.state;
    return this.fetchItems(search);
  }

  handleChange = ({ target: { value } }) => {
    this.updateState(value);
  }

  updateState= (param) => {
    this.setState({
      search: param,
    });
  }

  render() {
    return (
      <div>
        <span data-testid="home-initial-message">
          Digite algum termo de pesquisa ou escolha uma categoria.
        </span>
        <label htmlFor="query-input">
          <input type="text" data-testid="query-input" onChange={ this.handleChange } />
          <button
            id="bot??o"
            data-testid="query-button"
            type="submit"
            onClick={ this.filterInput }
          >
            Clique!
          </button>
        </label>
        <Link data-testid="shopping-cart-button" to="/checkout">Compra</Link>
        { this.renderCategorys() }
        { this.renderProducts() }
      </div>
    );
  }
}

export default ShoppingCart;
