package org.lamisplus.modules.hts.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.hts.domain.dto.RiskStratificationDto;
import org.lamisplus.modules.hts.domain.dto.RiskStratificationResponseDto;
import org.lamisplus.modules.hts.domain.entity.RiskStratification;
import org.lamisplus.modules.hts.repository.RiskStratificationRepository;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.lamisplus.modules.patient.service.PersonService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class RiskStratificationService {
    private final RiskStratificationRepository stratificationRepository;
    private final PersonRepository personRepository;
    private final PersonService personService;
    
    public RiskStratificationResponseDto save(RiskStratificationDto riskStratificationDTO) {
        Person person = null;
        if(riskStratificationDTO.getPersonId() != 0){
            person = this.getPerson(riskStratificationDTO.getPersonId());
        }
        RiskStratification riskStratification = this.toRiskStratification(riskStratificationDTO, person);
        return this.toRiskStratificationResponseDTO(stratificationRepository.save(riskStratification));
    }

    public Person getPerson(Long personId) {
        return personRepository.findById (personId)
                .orElseThrow (() -> new EntityNotFoundException(Person.class, "id", String.valueOf (personId)));
    }

    private RiskStratificationDto toRiskStratificationDTO(RiskStratification riskStratification) {
        if ( riskStratification == null ) {
            return null;
        }

        RiskStratificationDto riskStratificationDto = new RiskStratificationDto();

        riskStratificationDto.setAge( riskStratification.getAge() );
        riskStratificationDto.setTestingSetting( riskStratification.getTestingSetting() );
        riskStratificationDto.setModality( riskStratification.getModality() );
        riskStratificationDto.setTargetGroup( riskStratification.getTargetGroup() );
        riskStratificationDto.setVisitDate( riskStratification.getVisitDate() );
        riskStratificationDto.setDob(riskStratification.getDob());
        riskStratificationDto.setRiskAssessment( riskStratification.getRiskAssessment() );

        return riskStratificationDto;
    }

    private RiskStratificationResponseDto toRiskStratificationResponseDTO(RiskStratification riskStratification) {
        if ( riskStratification == null ) {
            return null;
        }

        RiskStratificationResponseDto responseDto = new RiskStratificationResponseDto();
        responseDto.setId(riskStratification.getId());
        responseDto.setAge( riskStratification.getAge() );
        responseDto.setTestingSetting( riskStratification.getTestingSetting() );
        responseDto.setModality( riskStratification.getModality() );
        responseDto.setCode( riskStratification.getCode() );
        responseDto.setTargetGroup( riskStratification.getTargetGroup() );
        responseDto.setDob( riskStratification.getDob() );
        responseDto.setVisitDate( riskStratification.getVisitDate() );
        responseDto.setRiskAssessment( riskStratification.getRiskAssessment() );

        return responseDto;
    }

    private RiskStratification toRiskStratification(RiskStratificationDto riskStratificationDTO, Person person) {
        if ( riskStratificationDTO == null ) {
            return null;
        }

        RiskStratification riskStratification = new RiskStratification();

        riskStratification.setAge( riskStratificationDTO.getAge() );
        if(person != null)riskStratification.setPersonUuid(person.getUuid());
        riskStratification.setTestingSetting( riskStratificationDTO.getTestingSetting() );
        riskStratification.setModality( riskStratificationDTO.getModality() );
        riskStratification.setCode( riskStratificationDTO.getCode() );
        riskStratification.setTargetGroup( riskStratificationDTO.getTargetGroup() );
        riskStratification.setVisitDate( riskStratificationDTO.getVisitDate() );
        riskStratification.setDob(riskStratificationDTO.getDob());
        riskStratification.setRiskAssessment( riskStratificationDTO.getRiskAssessment() );

        return riskStratification;
    }
    
    public void deleteById(Long id) {
        stratificationRepository.deleteById(id);
    }

    public Page<RiskStratification> findAll(Pageable pageable) {
        Page<RiskStratification> entityPage = stratificationRepository.findAll(pageable);
        List<RiskStratification> entities = entityPage.getContent();
        return new PageImpl<>(entities, pageable, entityPage.getTotalElements());
    }

    public List<RiskStratificationResponseDto> getAllByPersonId(Long personId) {
        Person person = personRepository.findById (personId).orElse(null);
        if(person == null){
            return new ArrayList<>();
        }
        return stratificationRepository.findAllByPersonUuid(person.getUuid())
                .stream()
                .map(riskStratification -> toRiskStratificationResponseDTO(riskStratification))
                .collect(Collectors.toList());
    }
}