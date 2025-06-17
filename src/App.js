import {useState} from "react";

const initialItems = [
  {id: 1, description: "Passports", quantity: 2, packed: false},
  {id: 2, description: "Socks", quantity: 12, packed: false},
  {id: 3, description: "Charger", quantity: 3, packed: false},
  {id: 4, description: "Cellphone", quantity: 22, packed: true},
];

function App() {
  const [items, setItems] = useState([...initialItems]);

  const handleAddItem = item => {
    setItems(items => [...items, item]);
  };
  const handleDeleteItem = id => {
    setItems(items => items.filter(item => item.id !== id));
  };
  const handleTogglePacked = id => {
    setItems(items =>
      items.map(item =>
        item.id === id ? {...item, packed: !item.packed} : item
      )
    );
  };
  const handleClearList = () => {
    const confitm = window.confirm(
      "Are you sure you want to clear the list? This action cannot be undone."
    );
    if (!confitm) return;
    console.log("Clearing list...");
    setItems([]);
  };

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItem} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onTogglePacked={handleTogglePacked}
        onClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>📖 To Do List 📝</h1>;
}
function Form({onAddItems}) {
  //state
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [packed, setPacked] = useState(false);

  // Functions
  const handleSubmit = event => {
    event.preventDefault();

    if (!description.trim()) {
      alert("Please enter a task description.");
      return;
    }
    const newItem = {
      id: Date.now(),
      description,
      quantity,
      packed,
    };
    onAddItems(newItem);
    console.log("New item added:", newItem);
    // Reset form fields
    setDescription("");
    setQuantity(1);
    setPacked(false);
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What are your tasks 🤓?</h3>
      <select
        value={quantity}
        onChange={event => setQuantity(Number(event.target.value))}
      >
        {Array.from({length: 20}, (_, index) => (
          <option key={index + 1} value={index + 1}>
            {index + 1}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Task description"
        value={description}
        onChange={event => setDescription(event.target.value)}
        required
      />
      <button type="submit">Add</button>
    </form>
  );
}
function PackingList({items, onDeleteItem, onTogglePacked, onClearList}) {
  const [sortBy, setSortBy] = useState("input");
  let sortedItems = [...items];
  switch (sortBy) {
    case "description":
      sortedItems = [...items].sort((a, b) =>
        a.description.localeCompare(b.description)
      );
      break;
    case "packed":
      sortedItems = [...items].sort((a, b) => a.packed - b.packed);
      break;
    default:
      sortedItems = items;
  }

  return (
    <div className="list">
      <ul>
        {sortedItems.map(item => (
          <Item
            key={item.id}
            item={item}
            onDeleteItem={onDeleteItem}
            onTogglePacked={onTogglePacked}
          />
        ))}
      </ul>

      <div className="actions">
        <select
          value={sortBy}
          onChange={event => setSortBy(event.target.value)}
        >
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button onClick={() => onClearList()}>Clear List</button>
      </div>
    </div>
  );
}
function Item({item, onDeleteItem, onTogglePacked}) {
  return (
    <li>
      <input
        type="checkbox"
        id={item.id}
        checked={item.packed}
        value={item.packed}
        onChange={() => onTogglePacked(item.id)}
      />
      <span
        style={item.packed ? {textDecoration: "line-through"} : {}}
        htmlFor={item.id}
      >
        {item.description} - {item.quantity}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}

function Stats({items}) {
  const totalItems = items.length;
  const packedItems = items.filter(item => item.packed).length;
  const packedPercentage = totalItems
    ? Math.round((packedItems / totalItems) * 100)
    : 0;
  return (
    <footer className="stats">
      <em>
        You have {totalItems} items on your list, and you already done{" "}
        {packedItems} ({packedPercentage}%)
      </em>
    </footer>
  );
}

export default App;
