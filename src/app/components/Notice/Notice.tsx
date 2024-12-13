import React from 'react';
import Marquee from 'react-fast-marquee';
import './Notice.module.css';

interface NoticeProps {
  message: string;
}

const Notice: React.FC<NoticeProps> = ({ message }) => {
  return (
    <div className="notice">
      <Marquee gradient={false} speed={50}>
        {message}
      </Marquee>
    </div>
  );
};

export default Notice;
