package com.generation.elestudiante.repository;

import com.generation.elestudiante.model.Reservation;
import com.generation.elestudiante.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    List<Reservation> findByUser(User user);
    List<Reservation> findByReservationDate(LocalDate date);
}