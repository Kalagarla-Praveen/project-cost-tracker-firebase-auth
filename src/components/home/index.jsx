import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

function Home() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [otherCosts, setOtherCosts] = useState([]);
  const [itemInput, setItemInput] = useState({ name: "", cost: "" });
  const [otherInput, setOtherInput] = useState({ description: "", amount: "" });
  const [editingItem, setEditingItem] = useState(null);
  const [editingOther, setEditingOther] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadData(currentUser.uid);
      }
    });
    return () => unsub();
  }, []);

  const loadData = (uid) => {
    const itemsRef = query(collection(db, "items"), where("uid", "==", uid));
    const othersRef = query(collection(db, "otherCosts"), where("uid", "==", uid));

    onSnapshot(itemsRef, (snapshot) => {
      setItems(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    onSnapshot(othersRef, (snapshot) => {
      setOtherCosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  };

  const addItem = async () => {
    if (!itemInput.name || !itemInput.cost) return;
    await addDoc(collection(db, "items"), {
      name: itemInput.name,
      cost: parseFloat(itemInput.cost),
      uid: user.uid,
    });
    setItemInput({ name: "", cost: "" });
  };

  const addOtherCost = async () => {
    if (!otherInput.description || !otherInput.amount) return;
    await addDoc(collection(db, "otherCosts"), {
      description: otherInput.description,
      amount: parseFloat(otherInput.amount),
      uid: user.uid,
    });
    setOtherInput({ description: "", amount: "" });
  };

  const deleteEntry = async (type, id) => {
    await deleteDoc(doc(db, type, id));
  };

  const saveItemEdit = async (item) => {
    const itemRef = doc(db, "items", item.id);
    await updateDoc(itemRef, {
      name: item.name,
      cost: parseFloat(item.cost),
    });
    setEditingItem(null);
  };

  const saveOtherEdit = async (cost) => {
    const costRef = doc(db, "otherCosts", cost.id);
    await updateDoc(costRef, {
      description: cost.description,
      amount: parseFloat(cost.amount),
    });
    setEditingOther(null);
  };

  const totalCost =
  items.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0) +
  otherCosts.reduce((sum, cost) => sum + (parseFloat(cost.amount) || 0), 0);


  return (
    <div className="m-12 p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center font-sans">Project Cost Tracker</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Add Item */}
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Add Item</h2>
          <input
            type="text"
            placeholder="Item Name"
            value={itemInput.name}
            onChange={(e) => setItemInput({ ...itemInput, name: e.target.value })}
            className="border p-2 w-full mb-2 rounded"
          />
          <input
            type="number"
            placeholder="Item Cost"
            value={itemInput.cost}
            onChange={(e) => setItemInput({ ...itemInput, cost: e.target.value })}
            className="border p-2 w-full mb-2 rounded"
          />
          <button
            onClick={addItem}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Add Item
          </button>
        </div>

        {/* Add Other Cost */}
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Add Other Cost</h2>
          <input
            type="text"
            placeholder="Description"
            value={otherInput.description}
            onChange={(e) => setOtherInput({ ...otherInput, description: e.target.value })}
            className="border p-2 w-full mb-2 rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={otherInput.amount}
            onChange={(e) => setOtherInput({ ...otherInput, amount: e.target.value })}
            className="border p-2 w-full mb-2 rounded"
          />
          <button
            onClick={addOtherCost}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            Add Cost
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Items</h2>
        {items.length === 0 ? (
          <p className="text-gray-500">No items added.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) =>
              editingItem === item.id ? (
                <li
                  key={item.id}
                  className="bg-yellow-100 p-2 flex justify-between rounded items-center"
                >
                  <div className="flex flex-col md:flex-row gap-2 w-full">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((i) =>
                            i.id === item.id ? { ...i, name: e.target.value } : i
                          )
                        )
                      }
                      className="border p-1 rounded w-full md:w-1/2"
                    />
                    <input
                      type="number"
                      value={item.cost}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((i) =>
                            i.id === item.id ? { ...i, cost: e.target.value } : i
                          )
                        )
                      }
                      className="border p-1 rounded w-full md:w-1/4"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveItemEdit(item)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </li>
              ) : (
                <li
                  key={item.id}
                  className="bg-gray-100 p-2 flex justify-between rounded items-center"
                >
                  <span>{item.name} - ₹{item.cost}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingItem(item.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEntry("items", item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </div>

      {/* Other Costs List */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Other Costs</h2>
        {otherCosts.length === 0 ? (
          <p className="text-gray-500">No other costs added.</p>
        ) : (
          <ul className="space-y-2">
            {otherCosts.map((cost) =>
              editingOther === cost.id ? (
                <li
                  key={cost.id}
                  className="bg-yellow-100 p-2 flex justify-between rounded items-center"
                >
                  <div className="flex flex-col md:flex-row gap-2 w-full">
                    <input
                      type="text"
                      value={cost.description}
                      onChange={(e) =>
                        setOtherCosts((prev) =>
                          prev.map((c) =>
                            c.id === cost.id
                              ? { ...c, description: e.target.value }
                              : c
                          )
                        )
                      }
                      className="border p-1 rounded w-full md:w-1/2"
                    />
                    <input
                      type="number"
                      value={cost.amount}
                      onChange={(e) =>
                        setOtherCosts((prev) =>
                          prev.map((c) =>
                            c.id === cost.id
                              ? { ...c, amount: e.target.value }
                              : c
                          )
                        )
                      }
                      className="border p-1 rounded w-full md:w-1/4"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveOtherEdit(otherCosts.find(c => c.id === cost.id))}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingOther(null)}
                        className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </li>
              ) : (
                <li
                  key={cost.id}
                  className="bg-gray-100 p-2 flex justify-between rounded items-center"
                >
                  <span>{cost.description} - ₹{cost.amount}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingOther(cost.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEntry("otherCosts", cost.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </div>

      {/* Total Cost */}
      <div className="mt-6 text-center">
        <h2 className="text-2xl font-bold">
          Total Project Cost: ₹{totalCost.toFixed(2)}
        </h2>
      </div>
    </div>
  );
}

export default Home;
