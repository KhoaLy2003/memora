-- liquibase formatted sql

-- changeset khoa.ly:1
CREATE TABLE users
(
    id         VARCHAR(36) PRIMARY KEY,
    email      VARCHAR(255) NOT NULL UNIQUE,
    full_name  VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    deleted    BOOLEAN DEFAULT FALSE
);

CREATE TABLE groups
(
    id                  VARCHAR(36) PRIMARY KEY,
    name                VARCHAR(255) NOT NULL,
    description         TEXT,
    storage_limit_bytes BIGINT       NOT NULL,
    used_storage_bytes  BIGINT       NOT NULL DEFAULT 0,
    avatar_url          TEXT,
    guest_invite_code   VARCHAR(255) UNIQUE,
    invite_code         VARCHAR(10) UNIQUE,
    created_at          TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    deleted             BOOLEAN               DEFAULT FALSE
);

CREATE TABLE memberships
(
    id         VARCHAR(36) PRIMARY KEY,
    user_id    VARCHAR(36) NOT NULL REFERENCES users (id),
    group_id   VARCHAR(36) NOT NULL REFERENCES groups (id),
    role       VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    deleted    BOOLEAN DEFAULT FALSE
);

CREATE TABLE albums
(
    id              VARCHAR(36) PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    cover_media_url TEXT,
    group_id        VARCHAR(36)  NOT NULL REFERENCES groups (id),
    created_at      TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    deleted         BOOLEAN DEFAULT FALSE
);

CREATE TABLE media
(
    id           VARCHAR(36) PRIMARY KEY,
    file_name    VARCHAR(255) NOT NULL,
    storage_path TEXT         NOT NULL,
    file_type    VARCHAR(10)  NOT NULL,
    size_bytes   BIGINT       NOT NULL,
    metadata     JSONB,
    album_id     VARCHAR(36)  NOT NULL REFERENCES albums (id),
    uploader_id  VARCHAR(36)  NOT NULL REFERENCES users (id),
    created_at   TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at   TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    deleted      BOOLEAN DEFAULT FALSE
);

CREATE TABLE sharing_links
(
    id            VARCHAR(36) PRIMARY KEY,
    token         VARCHAR(64) NOT NULL UNIQUE,
    album_id      VARCHAR(36) NOT NULL REFERENCES albums (id),
    expires_at    TIMESTAMP WITHOUT TIME ZONE,
    password_hash VARCHAR(255),
    allow_upload  BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at    TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    deleted       BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_media_album ON media (album_id);
CREATE INDEX idx_membership_user_group ON memberships (user_id, group_id);
-- rollback DROP INDEX idx_membership_user_group;
-- rollback DROP INDEX idx_media_album;
-- rollback DROP TABLE sharing_links;
-- rollback DROP TABLE media;
-- rollback DROP TABLE albums;
-- rollback DROP TABLE memberships;
-- rollback DROP TABLE groups;
-- rollback DROP TABLE users;
