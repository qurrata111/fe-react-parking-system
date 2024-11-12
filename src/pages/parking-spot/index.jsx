import React, { useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { useParkingSpot } from '../../context/parking-spot/context';
import Modal from '../../components/modal/Modal';
import moment from 'moment';
import 'moment/locale/id'

const SPOT_SIZE = 100;

const VEHICLE_SIZE = {
  small: 80,
  medium: 100,
  large: 120,
}

const SPACING_X = {
  small: 10,
  medium: 12,
  large: 30,
}

const SPACING_Y = {
  small: 80,
  medium: 80,
  large: 80,
}

const FONT_SIZE = {
  small: 12,
  medium: 16,
  large: 20,
}

const ParkingSpotIndex = () => {
  const { fetchPaginate, listWithPaginate, getDetail, detail, isLoading, updated, checkoutCustomer, book, resetState, } = useParkingSpot();
  const [groupedSpots, setGroupedSpots] = useState({});
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    fetchPaginate(1, 1000);
  }, [])

  useEffect(() => {
    if (listWithPaginate && listWithPaginate.parking_spots) {
      const grouped = listWithPaginate.parking_spots.reduce((acc, spot) => {
        if (!acc[spot.Location]) acc[spot.Location] = [];
        acc[spot.Location].push(spot);
        return acc;
      }, {});
      setGroupedSpots(grouped);
    }
  }, [listWithPaginate])

  useEffect(() => {
    if (detail) {
      setSelectedData(detail.parking_spot)
    }
  }, [detail])

  // HANDLE OPEN DETAIL PARKING SPOT
  const [isOpenModal, setIsOpenModal] = useState(false);

  const onCloseModal = () => {
    setSelectedData(null)
    setIsOpenModal(false)
  }

  useEffect(() => {
    if (updated) {
      console.log(updated);
      resetState();
      fetchPaginate(1, 1000);
    }
  }, [updated])
  // HANDLE OPEN DETAIL PARKING SPOT

  // HANDLE BOOKING
  const [customerName, setCustomerName] = useState("");
  const [plateNumber, setPlateNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    book(selectedData?.ID, {
      PlateNumber: plateNumber,
      CustomerName: customerName
    })
    setCustomerName("");
    setPlateNumber("");
    onCloseModal();
  };
  // HANDLE BOOKING

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
        <h3>Parking Spot</h3>
      </div>
      {isLoading && <div>loading...</div>}
      <Stage width={window.innerWidth} height={window.innerHeight} >
        <Layer>
          {Object.entries(groupedSpots).map(([location, spots], rowIndex) => (
            <React.Fragment key={location}>
              {spots.map((spot, spotIndex) => (
                <React.Fragment key={spotIndex}>
                  <Rect
                    key={spot.ID}
                    x={100 + spotIndex * (SPOT_SIZE + SPACING_X[spot.VehicleSize])}
                    y={rowIndex * (SPOT_SIZE + SPACING_Y[spot.VehicleSize]) + 30}
                    width={VEHICLE_SIZE[spot.VehicleSize]}
                    height={VEHICLE_SIZE[spot.VehicleSize]}
                    fill={spot.IsOccupied ? 'red' : 'green'}
                    stroke="black"
                    strokeWidth={1}
                    onClick={() => {
                      getDetail(spot.ID);
                      setIsOpenModal(true);

                    }}
                  />
                  <Text
                    x={100 + spotIndex * (SPOT_SIZE + SPACING_X[spot.VehicleSize])}
                    y={rowIndex * (SPOT_SIZE + SPACING_Y[spot.VehicleSize]) + 50}
                    text={spot.SpotNumber}
                    fontSize={FONT_SIZE[spot.VehicleSize]}
                    fill="black"
                  />
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </Layer>
      </Stage>
      <Modal
        width={400}
        title={`Rincian ${selectedData?.SpotNumber || ""}`}
        open={isOpenModal}
        onClose={onCloseModal}
        footer={<div
          style={{
            gap: 10,
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            padding: "10px 20px",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          {selectedData && selectedData?.IsOccupied && selectedData?.tr_parking ?
            <button
              style={{
                backgroundColor: "red",
                border: "none",
                fontSize: 14,
                cursor: "pointer",
                color: "white",
                padding: 5,
                borderRadius: 5,
              }}
              onClick={() => {
                checkoutCustomer(selectedData?.tr_parking.ID);
                onCloseModal();
              }}
            >
              Checkout
            </button> : null}

        </div>}
      >
        <div style={{ display: "flex", justifyContent: "center", alignContent: "center", width: "100%" }}>
          {!isLoading && selectedData &&
            <div style={{ width: "100%" }}>
              <table style={{ width: "100%", borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ textAlign: "left" }}>
                    <th scope="row" style={{ border: '1px solid black' }}>Lokasi</th>
                    <td style={{ border: '1px solid black' }}>{selectedData.SpotNumber}</td>
                  </tr>
                  <tr style={{ textAlign: "left" }}>
                    <th scope="row" style={{ border: '1px solid black' }}>Vehicle Size</th>
                    <td style={{ border: '1px solid black' }}>{selectedData.VehicleSize}</td>
                  </tr>
                  <tr style={{ textAlign: "left" }}>
                    <th scope="row" style={{ border: '1px solid black' }}>Is Occupied</th>
                    <td style={{ border: '1px solid black' }}>{selectedData.IsOccupied ? "YES" : "NO"}</td>
                  </tr>
                  {selectedData.IsOccupied && selectedData.tr_parking &&
                    <>
                      <tr style={{ textAlign: "left" }}>
                        <th scope="row" style={{ border: '1px solid black' }}>Customer</th>
                        <td style={{ border: '1px solid black' }}>{selectedData.tr_parking.CustomerName}</td>
                      </tr>
                      <tr style={{ textAlign: "left" }}>
                        <th scope="row" style={{ border: '1px solid black' }}>Plate Number</th>
                        <td style={{ border: '1px solid black' }}>{selectedData.tr_parking.PlateNumber}</td>
                      </tr>
                      <tr style={{ textAlign: "left" }}>
                        <th scope="row" style={{ border: '1px solid black' }}>Start Time</th>
                        <td style={{ border: '1px solid black' }}>{selectedData.tr_parking.StartTime ? moment(selectedData.tr_parking.StartTime).format('LLL') : ""}</td>
                      </tr>
                    </>}
                </tbody>
              </table>
              {!selectedData?.IsOccupied &&
                <div style={{ marginTop: 20, padding: "5px 20px" }}>
                  <h3 style={{ textAlign: "center" }}>Booking Form</h3>
                  <form onSubmit={handleSubmit} style={{ margin: "auto" }}>
                    <div style={{ marginBottom: 8 }}>
                      <label htmlFor="customerName" style={{ display: "block", fontWeight: "bold", marginBottom: "2px" }}>
                        Customer Name
                      </label>
                      <input
                        type="text"
                        id="customerName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                        placeholder="Enter customer name"
                        style={{
                          width: "100%",
                          padding: 4,
                          borderTop: 'none',
                          borderRight: 'none',
                          borderLeft: 'none',
                          borderBottom: "1px solid gray",
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label htmlFor="plateNumber" style={{ display: "block", fontWeight: "bold", marginBottom: "2px" }}>
                        Plate Number
                      </label>
                      <input
                        type="text"
                        id="plateNumber"
                        value={plateNumber}
                        onChange={(e) => setPlateNumber(e.target.value)}
                        required
                        placeholder="Enter plate number"
                        style={{
                          width: "100%",
                          padding: 4,
                          borderTop: 'none',
                          borderRight: 'none',
                          borderLeft: 'none',
                          borderBottom: "1px solid gray",
                          outline: 'none',
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        backgroundColor: "darkcyan",
                        border: "none",
                        fontSize: 14,
                        cursor: selectedData?.IsOccupied && selectedData?.tr_parking ? "not-allowed" : "pointer",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: 5,
                        float: "right"
                      }}
                    >
                      Submit
                    </button>
                  </form>
                </div>
              }
            </div>}
        </div >
      </Modal >
    </div >
  );
};

export default ParkingSpotIndex;