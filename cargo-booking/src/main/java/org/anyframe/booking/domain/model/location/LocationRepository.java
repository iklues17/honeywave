package org.anyframe.booking.domain.model.location;

import java.util.List;

public interface LocationRepository {

    Location find(UnLocode unLocode);

    List<Location> findAll();
}
