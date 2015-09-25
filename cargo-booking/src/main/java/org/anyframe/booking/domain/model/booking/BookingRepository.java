package org.anyframe.booking.domain.model.booking;

import java.util.List;

public interface BookingRepository {

    Booking findByBookingId(BookingId bookingId);

    List<Booking> findByUserId(String userId);

    void store(Booking booking);

    BookingId nextBookingId();

	List<Booking> findByBookingStatus(BookingStatus bookingStatus);
}
