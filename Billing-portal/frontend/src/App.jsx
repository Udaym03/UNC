
import { useState } from "react";
import "./index.css";

const initialCustomers = [
  { id: 1, name: "ABC Technologies", email: "abc@gmail.com", phone: "9876543210" },
  { id: 2, name: "Global Solutions", email: "global@gmail.com", phone: "9876543211" },
  { id: 3, name: "Bright Enterprises", email: "bright@gmail.com", phone: "9876543212" },
];

const initialInvoices = [
  { id: "INV-1001", customer: "ABC Technologies", date: "2026-10-10", amount: 25000, paid: 25000, status: "Paid" },
  { id: "INV-1002", customer: "Global Solutions", date: "2026-10-15", amount: 45000, paid: 20000, status: "Partial" },
  { id: "INV-1003", customer: "Bright Enterprises", date: "2026-10-20", amount: 18000, paid: 0, status: "Unpaid" },
];

function App() {
  const [page, setPage] = useState("Dashboard");
  const [customers, setCustomers] = useState(initialCustomers);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [showCustomer, setShowCustomer] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  const [customerForm, setCustomerForm] = useState({
    name: "", email: "", phone: ""
  });

  const [invoiceForm, setInvoiceForm] = useState({
    customer: "", amount: "", tax: "18"
  });

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.paid, 0);
  const outstanding = invoices.reduce((sum, inv) => sum + inv.amount - inv.paid, 0);
  const totalInvoices = invoices.length;

  function addCustomer(e) {
    e.preventDefault();
    setCustomers([...customers, { ...customerForm, id: Date.now() }]);
    setCustomerForm({ name: "", email: "", phone: "" });
    setShowCustomer(false);
  }

  function addInvoice(e) {
    e.preventDefault();
    const amount = Number(invoiceForm.amount);
    if (!amount || amount <= 0) return;

    const tax = Number(invoiceForm.tax);
    const total = amount + (amount * tax / 100);

    const newInvoice = {
      id: "INV-" + Date.now().toString().slice(-6),
      customer: invoiceForm.customer,
      date: new Date().toISOString().slice(0, 10),
      amount: total,
      paid: 0,
      status: "Unpaid",
    };

    setInvoices([...invoices, newInvoice]);
    setInvoiceForm({ customer: "", amount: "", tax: "18" });
    setShowInvoice(false);
  }

  function recordPayment(id) {
    const amount = Number(prompt("Enter payment amount in INR:"));
    if (!amount || amount <= 0) return;

    setInvoices(invoices.map(inv => {
      if (inv.id !== id) return inv;
      const paid = Math.min(inv.paid + amount, inv.amount);
      return {
        ...inv,
        paid,
        status: paid >= inv.amount ? "Paid" : "Partial"
      };
    }));
  }

  const navItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Customers", icon: "♙" },
    { name: "Invoices", icon: "▤" },
    { name: "Payments", icon: "₹" },
    { name: "Reports", icon: "▥" },
  ];

  function money(value) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">B</div>
          <div>
            <h2>BillPro</h2>
            <span>Billing Management</span>
          </div>
        </div>

        <p className="menu-label">MAIN MENU</p>

        <nav>
          {navItems.map(item => (
            <button
              key={item.name}
              className={page === item.name ? "nav-item active" : "nav-item"}
              onClick={() => setPage(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <span>Admin Account</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>{page}</h1>
            <p>Welcome back! Here's your business overview.</p>
          </div>
          <div className="top-actions">
            <span className="today">{new Date().toLocaleDateString("en-IN")}</span>
            <div className="avatar">A</div>
          </div>
        </header>

        {page === "Dashboard" && (
          <>
            <div className="welcome">
              <div>
                <h2>Business Dashboard</h2>
                <p>Track your invoices, customers and payments.</p>
              </div>
              <button className="primary-btn" onClick={() => setShowInvoice(true)}>
                + Create Invoice
              </button>
            </div>

            <section className="stats">
              <div className="stat-card">
                <span className="stat-icon purple">₹</span>
                <p>Total Revenue</p>
                <h2>{money(totalRevenue)}</h2>
                <small>Payments received</small>
              </div>
              <div className="stat-card">
                <span className="stat-icon orange">◷</span>
                <p>Outstanding</p>
                <h2>{money(outstanding)}</h2>
                <small>Pending payments</small>
              </div>
              <div className="stat-card">
                <span className="stat-icon blue">▤</span>
                <p>Total Invoices</p>
                <h2>{totalInvoices}</h2>
                <small>Invoices created</small>
              </div>
              <div className="stat-card">
                <span className="stat-icon green">♙</span>
                <p>Total Customers</p>
                <h2>{customers.length}</h2>
                <small>Registered customers</small>
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Recent Invoices</h2>
                  <p>Your latest billing transactions</p>
                </div>
                <button className="text-btn" onClick={() => setPage("Invoices")}>
                  View All →
                </button>
              </div>
              <InvoiceTable invoices={invoices.slice(0, 5)} money={money} />
            </section>
          </>
        )}

        {page === "Customers" && (
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Customers</h2>
                <p>Manage your business customers.</p>
              </div>
              <button className="primary-btn" onClick={() => setShowCustomer(true)}>
                + Add Customer
              </button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Phone</th></tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.email}</td>
                      <td>{c.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {page === "Invoices" && (
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Invoices</h2>
                <p>Create and manage customer invoices.</p>
              </div>
              <button className="primary-btn" onClick={() => setShowInvoice(true)}>
                + Create Invoice
              </button>
            </div>
            <InvoiceTable invoices={invoices} money={money} />
            <div className="payment-actions">
              <strong>Record a payment</strong>
              <p>Select an invoice below to record a payment.</p>
              {invoices.filter(i => i.paid < i.amount).map(i => (
                <button className="secondary-btn" key={i.id} onClick={() => recordPayment(i.id)}>
                  Record payment – {i.id}
                </button>
              ))}
            </div>
          </section>
        )}

        {page === "Payments" && (
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Payments</h2>
                <p>Payment summary for all invoices.</p>
              </div>
            </div>
            <InvoiceTable invoices={invoices} money={money} />
          </section>
        )}

        {page === "Reports" && (
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Business Reports</h2>
                <p>Current billing summary.</p>
              </div>
            </div>
            <div className="report-grid">
              <div>
                <span>Total billed</span>
                <h2>{money(invoices.reduce((s, i) => s + i.amount, 0))}</h2>
              </div>
              <div>
                <span>Collected</span>
                <h2>{money(totalRevenue)}</h2>
              </div>
              <div>
                <span>Pending</span>
                <h2>{money(outstanding)}</h2>
              </div>
            </div>
          </section>
        )}
      </main>

      {showCustomer && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={addCustomer}>
            <h2>Add New Customer</h2>
            <label>Customer Name</label>
            <input
              required
              value={customerForm.name}
              onChange={e => setCustomerForm({...customerForm, name: e.target.value})}
              placeholder="Enter customer name"
            />
            <label>Email</label>
            <input
              type="email"
              required
              value={customerForm.email}
              onChange={e => setCustomerForm({...customerForm, email: e.target.value})}
              placeholder="Enter email address"
            />
            <label>Phone</label>
            <input
              required
              value={customerForm.phone}
              onChange={e => setCustomerForm({...customerForm, phone: e.target.value})}
              placeholder="Enter phone number"
            />
            <div className="modal-actions">
              <button type="button" className="secondary-btn" onClick={() => setShowCustomer(false)}>
                Cancel
              </button>
              <button className="primary-btn">Save Customer</button>
            </div>
          </form>
        </div>
      )}

      {showInvoice && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={addInvoice}>
            <h2>Create New Invoice</h2>
            <label>Select Customer</label>
            <select
              required
              value={invoiceForm.customer}
              onChange={e => setInvoiceForm({...invoiceForm, customer: e.target.value})}
            >
              <option value="">Choose customer</option>
              {customers.map(c => <option key={c.id}>{c.name}</option>)}
            </select>
            <label>Amount before GST (₹)</label>
            <input
              type="number"
              min="1"
              required
              value={invoiceForm.amount}
              onChange={e => setInvoiceForm({...invoiceForm, amount: e.target.value})}
              placeholder="Enter amount"
            />
            <label>GST Rate</label>
            <select
              value={invoiceForm.tax}
              onChange={e => setInvoiceForm({...invoiceForm, tax: e.target.value})}
            >
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </select>
            <div className="modal-actions">
              <button type="button" className="secondary-btn" onClick={() => setShowInvoice(false)}>
                Cancel
              </button>
              <button className="primary-btn">Create Invoice</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function InvoiceTable({ invoices, money }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Paid</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.id}>
              <td><strong>{inv.id}</strong></td>
              <td>{inv.customer}</td>
              <td>{inv.date}</td>
              <td>{money(inv.amount)}</td>
              <td>{money(inv.paid)}</td>
              <td>
                <span className={"status " + inv.status.toLowerCase()}>
                  {inv.status}
                </span>
              </td>
            </tr>
          ))}
          {invoices.length === 0 && (
            <tr><td colSpan="6">No invoices available.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
