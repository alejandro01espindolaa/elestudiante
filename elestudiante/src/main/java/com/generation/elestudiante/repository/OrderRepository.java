package com.generation.elestudiante.repository;

import com.generation.elestudiante.model.Order;
import com.generation.elestudiante.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUser(User user);
}
