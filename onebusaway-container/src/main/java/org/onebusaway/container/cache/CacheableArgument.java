package org.onebusaway.container.cache;

import java.io.Serializable;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * A method parameter annotation that is used to further control how method
 * cache keys are generated by the
 * {@link AbstractCacheableMethodCallManager#getKeyFactoryForParameterType(Class)}
 * 
 * 
 * @author bdferris
 * @see CacheableInterceptor
 * @see CacheableMethodKeyFactory
 * @see AbstractCacheableMethodCallManager
 */
@Retention(value = RetentionPolicy.RUNTIME)
@Target(value = ElementType.PARAMETER)
public @interface CacheableArgument {

  /**
   * A bean property expression that is evaluated against the source method
   * argument to produce a cache key for that argument
   * 
   * @return a {@link Serializable} or something whose {@link Object#toString()}
   *         produces a unique value
   */
  String keyProperty() default "";
}
