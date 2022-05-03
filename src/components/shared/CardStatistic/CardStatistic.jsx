import React from 'react';
import './CardStatistic.scss';
import { FaIcons } from 'react-icons/fa';
const CardStatistic = (props) => {
  return (
    <div
      className="card-statistic-container"
      style={{
        width: props?.cardWidth ? props?.cardWidth : '100%',
        height: props?.cardHeight ? props?.cardHeight : '100%',
        padding: props?.cardPadding ? props?.cardPadding : 20,
        backgroundImage: props?.cardBackground
          ? props?.cardBackground
          : 'linear-gradient(to right, #346aba, #2b5ead, #22539f, #184892, #0c3d85)',
      }}
    >
      <div className="number" style={{ color: props?.numberColor ? props?.numberColor : '#FFF' }}>
        {props?.number ? props?.number : Math.floor(Math.random() * 1000 + 1)}
        {/* <div
          className="numberTotal"
          style={{ color: props?.numberTotalColor ? props?.numberTotalColor : '#FFF' }}
        >
          {props?.numberTotal ? props?.numberTotal : Math.floor(Math.random() * 1000 + 1)} Tổng Số
        </div> */}
      </div>
      <div className="type" style={{ color: props?.typeColor ? props?.typeColor : '#FFF' }}>
        {props?.type ? props?.type : 'Lorem Ipsum'}
      </div>
      <div
        className="icon"
        style={{
          bottom: props?.iconBottom ? props?.iconBottom : '-7px',
          right: props?.iconRight ? props?.iconRight : '-7px',
        }}
      >
        {props?.icon ? props?.icon : <FaIcons opacity={0.5} size={70} />}
      </div>
    </div>
  );
};

export default CardStatistic;
