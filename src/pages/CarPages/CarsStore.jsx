import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Modal, Form, Input, message, Select, Spin } from "antd";
import { generateClient } from 'aws-amplify/api';
import { listCars as listCarsQuery } from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import "./carsPage.css";
import CarDetailsModal from "./CarDetailsModal";
import CarCard from "./CarCard";
import { createNewUserCar, playSwitchSound, playOpeningSound, playClosingSound, checkAndUpdateAchievements } from "../../functions";
import { CreditWarningModal } from "../../components/CreditWarningModal/CreditWarningModal";

const { Option } = Select;
const client = generateClient();

const CarsStore = ({ playerInfo, setMoney, money }) => {
 const [cars, setCars] = useState([]);
 const [visible, setVisible] = useState(false); // Controls Create New Car modal visibility
 const [loadingBuy, setLoadingBuy] = useState(false);
 const [selectedCar, setSelectedCar] = useState(null);
 const [form] = Form.useForm();
 const [carDetailsVisible, setCarDetailsVisible] = useState(false);
 const [selectedCarIndex, setSelectedCarIndex] = useState(0);
 const [creditWarningModalvisible, setCreditWarningModalvisible] = useState(false);
 const [carsLoading, setCarsLoading] = useState(true);

 const carsContainerRef = useRef(null);

 const fetchCars = useCallback(async () => {
   try {
     const carData = await client.graphql({ query: listCarsQuery });
     setCars(carData.data.listCars.items);
   } catch (error) {
     console.error("Error fetching cars:", error);
   } finally {
     setCarsLoading(false);
   }
 }, []);

 useEffect(() => {
   async function fetchAllCars() {
     await fetchCars();
   }
   fetchAllCars();
 }, [fetchCars]);

 const handleKeyDown = useCallback((event) => {
   const { key } = event;
   const carsCount = cars.length;
   if (key === "ArrowRight" && !carDetailsVisible) {
      playSwitchSound();
      setSelectedCarIndex((prevIndex) => (prevIndex + 1) % carsCount);
   } else if (key === "ArrowLeft" && !carDetailsVisible) {
      playSwitchSound();
      setSelectedCarIndex((prevIndex) => (prevIndex - 1 + carsCount) % carsCount);
   } else if (key === "ArrowDown" && !carDetailsVisible) {
      playSwitchSound();
      setSelectedCarIndex((prevIndex) => (prevIndex + 5) % carsCount);
   } else if (key === "ArrowUp" && !carDetailsVisible) {
      playSwitchSound();
      setSelectedCarIndex((prevIndex) => (prevIndex - 5 + carsCount) % carsCount);
   } else if (key === "Enter" && !carDetailsVisible) {
      setSelectedCar(cars[selectedCarIndex]);
      playOpeningSound();
      showCarDetailsModal();
   }
 }, [cars, selectedCarIndex, carDetailsVisible]);

 useEffect(() => {
   document.addEventListener("keydown", handleKeyDown);
   return () => {
     document.removeEventListener("keydown", handleKeyDown);
   };
 }, [handleKeyDown]);

 const buyCar = async (car) => {
   if (playerInfo && playerInfo.id && money >= car.price) {
     playSwitchSound();
     setMoney(money - car.price);
     try {
       setLoadingBuy(true);
       await client.graphql({
         query: mutations.updateUser,
         variables: {
           input: {
             id: playerInfo.id,
             money: money - car.price,
             totalSpent: (playerInfo.totalSpent || 0) + car.price
           },
         },
       });
       createNewUserCar(playerInfo.id, car.id);
       message.success('Car successfully bought!');
     } catch (err) {
       console.log(err);
       message.error('Error buying car');
     } finally {
       setLoadingBuy(false);
       setSelectedCar(null);
     }
   } else if (playerInfo && money < car.price) {
     setCreditWarningModalvisible(true);
     handleCarDetailsCancel();
     return;
   }
   await checkAndUpdateAchievements(playerInfo);
 };

 const showCarDetailsModal = () => setCarDetailsVisible(true);

 const handleCancel = () => {
   playClosingSound();
   setVisible(false);
 };

 const handleCarDetailsCancel = () => {
   playClosingSound();
   setCarDetailsVisible(false);
 };

 const createNewCar = async (values) => {
   const newCar = {
     make: values.make,
     model: values.model,
     year: parseInt(values.year),
     price: parseInt(values.price),
     type: values.type,
   };
   try {
     await client.graphql({
       query: mutations.createCar,
       variables: { input: newCar },
     });
     message.success('Car created successfully!');
     await fetchCars(); // Refetch cars after adding a new one
     setVisible(false);
     form.resetFields();
   } catch (error) {
     console.error("Error creating car:", error);
     message.error('Failed to create car');
   }
 };

 const getImageSource = (make, model) => {
   const imageName = `${make} ${model}.png`;
   return require(`../../assets/images/${imageName}`);
 };

 return (
   <div className="cars">
     {/* <Button type="primary" style={{ marginBottom: '20px' }} onClick={() => setVisible(true)}>
       Create New Car
     </Button> */}
     {carsLoading ? (
       <Spin size="large" fullscreen />
     ) : (
       <div ref={carsContainerRef} className="cars__container">
         {cars.length && cars.map((car, index) => (
           <CarCard
             key={car.id}
             selectedCar={index === selectedCarIndex ? car : null}
             setSelectedCar={(car) => {
               setSelectedCar(car);
               setSelectedCarIndex(index);
               showCarDetailsModal();
             }}
             showCarDetailsModal={showCarDetailsModal}
             car={car}
             getImageSource={getImageSource}
             showPrice
           />
         ))}
       </div>
     )}

     <Modal
       visible={visible}
       title="Create a New Car"
       okText="Create"
       cancelText="Cancel"
       onCancel={handleCancel}
       onOk={() => {
         form
           .validateFields()
           .then((values) => createNewCar(values))
           .catch((info) => console.log('Validate Failed:', info));
       }}
     >
       <Form form={form} layout="vertical" onFinish={(values) => createNewCar(values)}>
         <Form.Item name="make" label="Make" rules={[{ required: true, message: 'Please enter the make!' }]}>
           <Input autoFocus />
         </Form.Item>
         <Form.Item name="model" label="Model" rules={[{ required: true, message: 'Please enter the model!' }]}>
           <Input />
         </Form.Item>
         <Form.Item name="year" label="Year" rules={[{ required: true, message: 'Please enter the year!' }]}>
           <Input type="number" />
         </Form.Item>
         <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter the price!' }]}>
           <Input type="number" />
         </Form.Item>
         <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please select the type!' }]}>
           <Select>
             <Option value="regular">Regular</Option>
             <Option value="epic">Epic</Option>
             <Option value="legendary">Legendary</Option>
           </Select>
         </Form.Item>
       </Form>
     </Modal>

     <CarDetailsModal
       visible={carDetailsVisible && selectedCar !== null}
       handleCancel={handleCarDetailsCancel}
       selectedCar={selectedCar}
       buyCar={buyCar}
       loadingBuy={loadingBuy}
     />
     <CreditWarningModal isModalVisible={creditWarningModalvisible} setIsModalVisible={setCreditWarningModalvisible} />
   </div>
 );
};

export default CarsStore;