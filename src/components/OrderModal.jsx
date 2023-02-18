import React, { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./styles/OrderModal.module.css";

function OrderModal({ order, setOrderModal }) {
  const navigate = useNavigate()
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [valid, setValid] = useState(true)
  const [nameValid, setNameValid] = useState(true)
  const [phoneValid, setPhoneValid] = useState(true)
  const [addressValid, setAddressValid] = useState(true)

  // const placeOrder = () => { // dummy placeOrder function for testing
  //   console.log("All good", order, name, formattedPhone, address)
  // }

  const placeOrder = async () => {
    const onlyNumberPhone = phone.replace(/\D/g, '')
    // eslint-disable-next-line max-len
    const formattedPhone = `(${onlyNumberPhone.slice(0, 3)}) ${onlyNumberPhone.slice(3, 6)}-${onlyNumberPhone.slice(6, 10)}`

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        phone: formattedPhone,
        address,
        items: order
      })
    });
    const data = await response.json();
    const id = await data.id
    if (response.ok) navigate(`/order-confirmation/${id}`)
  };


  const checkValid = (cName, cPhone, cAddress) => {
    if (cName.trim().length > 0
      && cPhone.trim().length > 0
      && cAddress.trim().length > 0) {
      setValid(true)
      setNameValid(true)
      setPhoneValid(true)
      setAddressValid(true)
      placeOrder()
    }
    else {
      setValid(false)
      if (name.trim().length <= 0) setNameValid(false)
      if (phone.trim().length <= 0) setPhoneValid(false)
      if (address.trim().length <= 0) setAddressValid(false)
    }
  }

  const handleName = (e) => {
    e.preventDefault();
    setName(e.target.value);
    if (e.target.value.trim().length > 0) setNameValid(true)
    else setNameValid(false)
  }

  const handlePhone = (e) => {
    e.preventDefault()
    const pattern = /^[0-9\b()-]+$/
    if (e.target.value === '' || pattern.test(e.target.value)) setPhone(e.target.value)
    if (e.target.value.length > 0) setPhoneValid(true)
    else setPhoneValid(false)
  }

  const handleAddress = (e) => {
    e.preventDefault();
    setAddress(e.target.value);
    if (e.target.value.trim().length > 0) setAddressValid(true)
    else setAddressValid(false)
  }

  return (
    <>
      <div
        label="Close"
        className={styles.orderModal}
        onKeyPress={(e) => {
          if (e.key === "Escape") {
            setOrderModal(false);
          }
        }}
        onClick={() => setOrderModal(false)}
        role="menuitem"
        tabIndex={0}
      />
      <div className={styles.orderModalContent}>
        <h2>Place Order</h2>
        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">
              Name {!nameValid && <span className={styles.invalid}>*</span>}
              <input
                onChange={handleName}
                type="text"
                id="name"
                value={name}
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">
              Phone {!phoneValid && <span className={styles.invalid}>*</span>}
              <input
                onChange={handlePhone}
                value={phone}
                type="phone"
                id="phone"

              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">
              Address {!addressValid && <span className={styles.invalid}>*</span>}
              <input
                onChange={handleAddress}
                type="phone"
                id="address"
              />
            </label>
          </div>
        </form>

        {!valid &&
          <div className={styles.invalidText}>
            <p>Please fill in the fields with required values!</p>
          </div>
        }

        <div className={styles.orderModalButtons}>
          <button
            className={styles.orderModalClose}
            onClick={() => setOrderModal(false)}
          >
            Close
          </button>
          <button
            onClick={() => {
              checkValid(name, phone, address)
              // console.log(valid)
            }}
            className={styles.orderModalPlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  );
}

export default OrderModal;
