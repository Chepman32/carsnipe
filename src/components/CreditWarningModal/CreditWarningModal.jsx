// src/components/CreditWarningModal.js
import React, { useState } from 'react';
import { Modal, Button } from 'antd';

export const CreditWarningModal = ({ isModalVisible, setIsModalVisible }) => {

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // Handle "Add Credits" action, e.g., redirect to payment page
    console.log('Redirect to add credits page');
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      {/* Trigger button to open the modal */}
      <Button type="primary" onClick={showModal}>
        Check Credits
      </Button>

      {/* The Modal itself */}
      <Modal
        title="Insufficient Credits"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Add Credits"
              cancelText="Cancel"
              centered
      >
        <p>You have insufficient credits to perform this action. Please add more credits to continue.</p>
      </Modal>
    </div>
  );
};