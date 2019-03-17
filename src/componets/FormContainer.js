import React from "react";
import FieldContainer from "./FieldContainer";
import data from "../data/info";

class FormContainer extends React.Component {
  constructor(props) {
    super(props);
          /* 
        We set the state, to create a mock up of the payload needed for the API
        https://docs.afterpay.com/us-online-api-v1.html#create-order
        TotalAmount -> Required
        Merchant -> Required
        Consumer -> Required
        We also create flags for display Content (Since its a small app No react router need it.)
      */
    this.state = {


      totalAmount: {
        amount: "",
        currency: "USD"
      },
      consumer: {
        phoneNumber: "2120000000",
        givenNames: "Joe",
        surname: "Consumer",
        email: "test@afterpay.com"
      },
      merchant: {
        redirectConfirmUrl: "https://www.merchant.com/confirm",
        redirectCancelUrl: "https://www.merchant.com/cancel"
      },
      shipping: {
        "street name": "",
        "street number": "",
        "city": "",
        "state": "",
        "zip code": "",
        "country code": "US",
        "phone number": "2489965651"
      },
      showFields: true,
      showWarning: false,
      successfull: false,
    };
    this.addFieldValue = this.addFieldValue.bind(this);
    this.payNowButton = this.payNowButton.bind(this);
  }

  addFieldValue = (value, field, fieldsType) => {
    // Function to set up the state on change, since we need to set up different parts to complete the payload
    // We have to check... can be made ir more smart with more time, to DRY this a little bit.
    let objState = {};
    if (fieldsType === "shipping") {
      objState[field.toLowerCase()] = value;
      let newShipping = Object.assign({}, this.state.shipping, objState);
      this.setState({ shipping: newShipping });
    }

    if (fieldsType === "payments") {
      //We set the state based on the Fields. (Make it easier to add new fields)
      objState[field.toLowerCase()] = value;
      let newPayments = Object.assign({}, this.state.totalAmount, objState);
      this.setState({ totalAmount: newPayments });
    }

    if (fieldsType === "consumer") {
      //Consumer have a special logic that I had to adapt.
      // givenNames have to do an exact match.
      if (field.split(" ").length > 1){
        //Special case for Given name to accomodate it to what the API needs to works... 
        let splitFirst = field.split(" ")[0].toLowerCase();
        let splitSecond = field.split(" ")[1];
        objState[splitFirst+splitSecond] = value;
      }
      else {
        objState[field.toLowerCase()] = value;
      }
      let newConsumer = Object.assign({}, this.state.consumer, objState);
      this.setState({ consumer: newConsumer });
    }
  };

  continueButton = () => {
    //Continue button, since on the on change we set up the state again, the state should have all the fields
    //if there is an empty value means that the user is missing a value...
    //due to the time issue is only checking for blank spaces, we need to validate stuffs like strings, numbers, emails.
    if (!Object.values(this.state.shipping).some(data => data === "")) {
      //If we have the state all set up then we remove the container, toggleing the state.
      // Also we toggle the error message if we have it.
      this.setState({ showFields: false, showWarning: false });
    } else {
      //If the user have a missing field we toggle the error message.
      this.setState({ showWarning: true });
    }
  };

  payNowButton = () => {
    //Did a bunch of calls using POSTMAN to veryfy the fields needed and how you are expecting it, figured out that 
    // we have a minimunt amount of 35 minimun is required.
    //I missed some validations and make the amout look nice.
    if (!Object.values(this.state.totalAmount).some(data => data === "") && this.state.totalAmount.amount >35) {
      //If we have amounts, we checked for fields already before and the amount is more than 35... we do the post
      fetch("https://api.us-sandbox.afterpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic MTAwMTAwMTgzOjU3NDA0MWZkNzc1ODhjNTNiNDQ5ZGFiYjM5NWExODg1OWRjYjJiYzg5YzdiMDNhMWNhY2VlZWI0OTdjNzU5NTE1MzU2MzIwZWYwZTUzYzE2N2IyMmYyZDBiYzMyNTg4ODVhODAwNzQ4OGE3MDUwMWY5ZDgwYjc5NDQ1OWQwNzE1"
        },
        body: JSON.stringify({
          totalAmount: this.state.totalAmount,
          consumer: this.state.consumer,
          merchant: this.state.merchant
        })
      }).then(res => {
        //in case everything wroks... we trigger another flag in the state to render a successfull message.
        this.setState({successfull:true})
      });
      this.setState({ showFields: false, showWarning: false });
    } else {
      this.setState({ showWarning: true });
    }
  };

  render() {
    return (
      <div className="main__container--address">
      {this.state.successfull ? <div className="main__container--complete"> Payment Complete! Thanks! </div> :
      this.state.showFields ? (
        <div>
          <div className="main__container--header">
            Please fill your Information
          </div>
          {data.fields.shipping.map(info => (
            <FieldContainer
              key={info}
              label={info}
              fieldsType={"shipping"}
              addFieldValue={this.addFieldValue}
            />
          ))}
          {data.fields.consumer.map(info => (
            <FieldContainer
              key={info}
              label={info}
              fieldsType={"consumer"}
              addFieldValue={this.addFieldValue}
            />
          ))}
          {this.state.showWarning ? (
            <div className="main__container--error">
              * Some Fields are missing!{" "}
            </div>
          ) : null}
          <div className="main__container--button">
            <button type="button" onClick={this.continueButton}>
              Continue{" "}
            </button>{" "}
          </div>{" "}
        </div>
      ) : (
        <div>
          <div className="main__container--header">
            Please fill your Address{" "}
          </div>
          {data.fields.payments.map(info => (
            <FieldContainer
              key={info}
              label={info}
              fieldsType={"payments"}
              addFieldValue={this.addFieldValue}
            />
          ))}{" "}
          {this.state.showWarning ? (
            <div className="main__container--error">
              * Missing Amount or Minimunt Payment of $35 Needed it!{" "}
            </div>
          ) : null}
          <div className="main__container--button-payment">
            <button type="button" onClick={this.payNowButton}>
              Pay Now{" "}
            </button>{" "}
          </div>{" "}
        </div>
      )}        
      </div>
    );
  }
}

export default FormContainer;
