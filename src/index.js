import React from "react";
import ReactDOM from "react-dom";
import CRUDTable, {
  Fields,
  Field,
  CreateForm,
  UpdateForm,
  DeleteForm,
} from "react-crud-table";

// Component's Base CSS
import "./index.css";

let books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    pages: "208",
    bookcount: "17",
    price: "Rs.2800",
  },
  {
    id: 2,
    title: "In Search of Lost Time",
    author: "Marcel Proust",
    pages: "1225",
    bookcount: "12",
    price: "Rs.4600",
  },
  {
    id: 3,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    pages: "304",
    bookcount: "25",
    price: "Rs.1650",
  },
  {
    id: 4,
    title: "Thirteen Reasons Why",
    author: "Jay Asher",
    pages: "288",
    bookcount: "22",
    price: "Rs.2200",
  },
  {
    id: 5,
    title: "The Infernal Devices",
    author: "Cassandra Clar",
    pages: "784",
    bookcount: "15",
    price: "Rs.2400",
  },
];

const SORTERS = {
  NUMBER_ASCENDING: (mapper) => (a, b) => mapper(a) - mapper(b),
  NUMBER_DESCENDING: (mapper) => (a, b) => mapper(b) - mapper(a),
  STRING_ASCENDING: (mapper) => (a, b) => mapper(a).localeCompare(mapper(b)),
  STRING_DESCENDING: (mapper) => (a, b) => mapper(b).localeCompare(mapper(a)),
};

const getSorter = (data) => {
  const mapper = (x) => x[data.field];
  let sorter = SORTERS.STRING_ASCENDING(mapper);

  if (data.field === "id") {
    sorter =
      data.direction === "ascending"
        ? SORTERS.NUMBER_ASCENDING(mapper)
        : SORTERS.NUMBER_DESCENDING(mapper);
  } else {
    sorter =
      data.direction === "ascending"
        ? SORTERS.STRING_ASCENDING(mapper)
        : SORTERS.STRING_DESCENDING(mapper);
  }

  return sorter;
};

let count = books.length;
const service = {
  fetchItems: (payload) => {
    let result = Array.from(books);
    result = result.sort(getSorter(payload.sort));
    return Promise.resolve(result);
  },
  create: (book) => {
    count += 1;
    books.push({
      ...book,
      id: count,
    });
    return Promise.resolve(book);
  },
  update: (data) => {
    const book = books.find((t) => t.id === data.id);
    book.title = data.title;
    book.author = data.author;
    book.pages = data.pages;
    book.bookcount = data.bookcount;
    book.price = data.price;
    return Promise.resolve(book);
  },
  delete: (data) => {
    const book = books.find((t) => t.id === data.id);
    books = books.filter((t) => t.id !== book.id);
    return Promise.resolve(book);
  },
};

const styles = {
  container: { margin: "auto", width: "90%" },
};

const Example = () => (
  <div className="divbody">
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo-text">House of Books</span>
        </div>
        <div className="topRight">
          <button className="signout-button">Sign Out</button>
        </div>
      </div>
    </div>
    <br></br>
    <div style={styles.container}>
      <CRUDTable
        caption="All Books"
        fetchItems={(payload) => service.fetchItems(payload)}
      >
        <Fields>
          <Field name="id" label="Id" hideInCreateForm hideInUpdateForm />
          <Field name="title" label="Title" placeholder="Title" />
          <Field name="author" label="Author" placeholder="Author" />
          <Field name="pages" label="Pages" placeholder="Pages" />
          <Field name="bookcount" label="Book Count" placeholder="Book Count" />
          <Field name="price" label="Price (Rs.)" placeholder="Price" />
        </Fields>
        <CreateForm
          title="Add New Book"
          trigger="Add New Book"
          onSubmit={(book) => service.create(book)}
          submitText="Create"
          validate={(values) => {
            const errors = {};
            if (!values.title) {
              errors.title = "Please, Provide Book Title";
            }

            if (!values.author) {
              errors.author = "Please, Provide Book Author";
            }

            if (!values.pages) {
              errors.pages = "Please, Provide Book's Page Count";
            }

            if (!values.bookcount) {
              errors.bookcount = "Please, Provide Book Count";
            }

            if (!values.price) {
              errors.price = "Please, Provide Book Price";
            }

            return errors;
          }}
        />

        <UpdateForm
          title="Update Book Details"
          trigger="Update"
          onSubmit={(book) => service.update(book)}
          submitText="Update"
          validate={(values) => {
            const errors = {};

            if (!values.id) {
              errors.id = "Please, Provide Id";
            }

            if (!values.title) {
              errors.title = "Please, Provide Book Title";
            }

            if (!values.author) {
              errors.author = "Please, Provide Book author";
            }

            if (!values.pages) {
              errors.pages = "Please, Provide Book's Page Count";
            }

            if (!values.bookcount) {
              errors.bookcount = "Please, Provide Book Count";
            }

            if (!values.author) {
              errors.author = "Please, Provide Book Price";
            }

            return errors;
          }}
        />

        <DeleteForm
          title="Delete Book Details"
          message="Are You Sure You Want to Delete This Book Details?"
          trigger="Delete"
          onSubmit={(book) => service.delete(book)}
          submitText="Delete"
          validate={(values) => {
            const errors = {};
            if (!values.id) {
              errors.id = "Please, Provide Id";
            }
            return errors;
          }}
        />
      </CRUDTable>
    </div>
    <br></br>
    <div className="footer">
    <p>© 2022 House of Books</p>
  </div>
  </div>
);

Example.propTypes = {};

ReactDOM.render(<Example />, document.getElementById("root"));
