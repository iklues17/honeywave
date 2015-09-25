package com.sds.fsf.cmm.service.util;

import java.util.concurrent.atomic.AtomicLong;

public class IdGenerator {
  public static AtomicLong idCount = new AtomicLong();

  public static String generateId() {
    return Long.toString(System.currentTimeMillis()) + "-" + Long.toString(idCount.incrementAndGet());
  }

  public static long generateLongId() {
    return Long.parseLong(Long.toString(System.currentTimeMillis()) + Long.toString(idCount.incrementAndGet()));
  }
}
