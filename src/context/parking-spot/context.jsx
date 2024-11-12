import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/api';

const ParkingSpotContext = createContext({
  isLoading: false,
  listWithPaginate: [],
  detail: null,
  updated: null,
  fetchPaginate: (page, limit) => { },
  resetState: () => { },
  getDetail: (id) => { },
  checkoutCustomer: (id) => { },
  book: (id, body) => { },
});

export const ParkingSpotProvider = ({ children }) => {
  const [listWithPaginate, setListWithPaginate] = useState(null);
  const [detail, setDetail] = useState(null);
  const [updated, setUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPaginate = async (page, limit) => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/parking-spot/paginate`, {
        params: {
          page,
          limit,
        },
      });
      setListWithPaginate(data);
    } catch (error) {
      console.error('Error fetching parking spots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDetail = async (id) => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/parking-spot/detail/${id}`);
      setDetail(data);
    } catch (error) {
      console.error('Error fetching parking spots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkoutCustomer = async (id) => {
    try {
      setIsLoading(true);
      const { data } = await api.post(`/tr-parking/checkout/${id}`);
      setUpdated(data);
    } catch (error) {
      console.error('Error checkout customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const book = async (id, body) => {
    try {
      setIsLoading(true);
      const { data } = await api.post(`/parking-spot/book/${id}`, body);
      setUpdated(data);
    } catch (error) {
      console.error('Error book parking spot:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setListWithPaginate(null)
    setDetail(null);
    setUpdated(null);
  }

  return (
    <ParkingSpotContext.Provider
      value={{
        isLoading,
        listWithPaginate,
        detail,
        updated,
        fetchPaginate,
        getDetail,
        checkoutCustomer,
        book,
        resetState,
      }}
    >
      {children}
    </ParkingSpotContext.Provider>
  );
};

ParkingSpotProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useParkingSpot = () => useContext(ParkingSpotContext);
