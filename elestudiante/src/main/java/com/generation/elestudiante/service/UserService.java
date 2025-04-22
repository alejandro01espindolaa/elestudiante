package com.generation.elestudiante.service;

import com.generation.elestudiante.dto.DirectionsRequest;
import com.generation.elestudiante.model.Directions;
import com.generation.elestudiante.model.User;
import com.generation.elestudiante.repository.DirectionsRepository;
import com.generation.elestudiante.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DirectionsRepository directionsRepository;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, DirectionsRepository directionsRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.directionsRepository = directionsRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    public User addUser(User user){
        Optional<User> optionaUser = userRepository.findByEmail(user.getEmail());
        if(optionaUser.isPresent())throw  new IllegalArgumentException("El correo ya existe");
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        return userRepository.save(user);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
    public User addDirectionUser(Integer id, DirectionsRequest directionRequest){
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("EL usuario no tiene direccion"));
        Directions direction = new Directions();
        if(directionRequest.getStreet() != null)direction.setStreet(directionRequest.getStreet());
        if(directionRequest.getNeighborhood() != null)direction.setNeighborhood(directionRequest.getNeighborhood());
        if(directionRequest.getZipCode() != null)direction.setZipCode(directionRequest.getZipCode());
        if(directionRequest.getCountry() != null)direction.setCountry(directionRequest.getCountry());
        direction.setUser(user);
        directionsRepository.save(direction);
        return userRepository.save(user);
    }


    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }
}