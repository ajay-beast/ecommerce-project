package com.ajay.ecommerce.config;

import com.ajay.ecommerce.entity.Country;
import com.ajay.ecommerce.entity.Product;
import com.ajay.ecommerce.entity.ProductCategory;
import com.ajay.ecommerce.entity.State;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration

public class MyDataRestConfig implements RepositoryRestConfigurer {

  private EntityManager entityManager;

  @Autowired
  public MyDataRestConfig(EntityManager entityManager) {
    this.entityManager = entityManager;
  }

  @Override
  public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config,
      CorsRegistry cors) {
    HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

    disableHttpMethods(Product.class, config, theUnsupportedActions);

    disableHttpMethods(ProductCategory.class, config, theUnsupportedActions);

    disableHttpMethods(Country.class, config, theUnsupportedActions);

    disableHttpMethods(State.class, config, theUnsupportedActions);

    exposeIds(config);
  }

  private static void disableHttpMethods(Class theClass, RepositoryRestConfiguration config,
      HttpMethod[] theUnsupportedActions) {
    config.getExposureConfiguration().forDomainType(theClass)
        .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions)))
        .withCollectionExposure(
            ((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions)));
  }

  private void exposeIds(RepositoryRestConfiguration config) {
    Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
    config.exposeIdsFor(entities.stream()
        .map(EntityType::getJavaType)
        .toArray(Class[]::new));

  }
}
