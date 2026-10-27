import React from 'react';
import { InvitationConfig } from '../config/invitationContent';

export const EditorialEventCard: React.FC<{ config: InvitationConfig }> = ({ config }) => (
  <div className="editorial-event-card" id="event-details" tabIndex={-1} aria-label="Thông tin thời gian và địa điểm khai trương">
    <div className="event-day"><strong>07</strong><span>THÁNG 11<br />2026</span></div>
    <div className="event-meta"><strong>{config.event.startTime} · Thứ Bảy</strong><span>{config.event.address}</span></div>
    <div className="event-dress">✦ &nbsp; DRESS CODE &nbsp; {config.event.dressCode} / Smart</div>
  </div>
);
