package org.anyframe.booking.domain.model.booking;

public enum BookingStatus {

	NOT_ACCEPTED, ACCEPTED;
	
	public boolean sameValueAs(BookingStatus other) {
        return this.equals(other);
    }

}
