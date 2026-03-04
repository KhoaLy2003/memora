package com.khoaly.memora.feature.user.entity;

import com.khoaly.memora.common.entity.BaseEntity;
import com.khoaly.memora.feature.group.entity.Membership;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String fullName;

    private String avatarUrl;

    @OneToMany(mappedBy = "user")
    private List<Membership> memberships = new ArrayList<>();
}
