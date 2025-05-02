-- SQLINES DEMO *** le SQL Developer Data Modeler 21.2.0.183.1957
-- SQLINES DEMO *** -07-07 22:04:48 COT
-- SQLINES DEMO ***  Server 2012
-- SQLINES DEMO *** Server 2012



-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE answers
    (
     id_answer bigserial NOT NULL ,
     options_answer VARCHAR (8000) NOT NULL ,
     datereg_answer TIMESTAMP(3) NOT NULL ,
     dateupdate_answer TIMESTAMP(3) NOT NULL ,
     questions_id_question BIGINT NOT NULL
    );




-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE UNIQUE NONCLUSTERED INDEX
    answers__IDX ON answers
    (
     questions_id_question
    );


ALTER TABLE answers ADD CONSTRAINT answers_PK PRIMARY KEY (id_answer)
     ;


-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE courses
    (
     id_course bigserial NOT NULL ,
     name_course VARCHAR (50) NOT NULL ,
     description_course VARCHAR (100) NOT NULL ,
     keywords_course TEXT ,
     pathimg_course VARCHAR (75) ,
     datereg_course TIMESTAMP(3) NOT NULL ,
     dateupdate_course TIMESTAMP(3) NOT NULL ,
     state_course CHAR (1) NOT NULL ,
     persons_id_person BIGINT NOT NULL
    );

ALTER TABLE courses ADD CONSTRAINT courses_PK PRIMARY KEY (id_course)
     ;


-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE evaluations
    (
     "id_evaluation" bigserial NOT NULL ,
     name_evaluation VARCHAR (500) NOT NULL ,
     description_evaluation VARCHAR (100) NOT NULL ,
     datereg_evaluation TIMESTAMP(3) NOT NULL ,
     dateupdate_evaluation TIMESTAMP(3) NOT NULL ,
     time_evaluation BOOLEAN NOT NULL ,
     timeminutes_evaluation BIGINT ,
     numberquestion_evaluation INTEGER ,
     levels_id_levels BIGINT NOT NULL
    );

ALTER TABLE evaluations ADD CONSTRAINT evaluations_PK PRIMARY KEY ("id-evaluation")
     ;


-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE levels
    (
     id_levels bigserial NOT NULL ,
     name_level VARCHAR (10) NOT NULL ,
     description_level VARCHAR (100) ,
     state_level CHAR (1) NOT NULL ,
     modules_id_module BIGINT NOT NULL
    );

ALTER TABLE levels ADD CONSTRAINT levels_PK PRIMARY KEY (id_levels)
     ;


-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE modules
    (
     id_module bigserial NOT NULL ,
     name_module VARCHAR (50) NOT NULL ,
     description_module VARCHAR (100) NOT NULL ,
     keywords_module TEXT ,
     pathimg_modules VARCHAR (75) ,
     datereg_module TIMESTAMP(3) NOT NULL ,
     dateupdate_module TIMESTAMP(3) NOT NULL ,
     state_module CHAR (1) NOT NULL ,
     syllabus_id_syllabu BIGINT NOT NULL
    );

ALTER TABLE modules ADD CONSTRAINT modules_PK PRIMARY KEY (id_module)
     ;


-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE persons
    (
     id_person bigserial NOT NULL ,
     name_person VARCHAR(50) NOT NULL ,
     lastname_person VARCHAR(50) NOT NULL ,
     email_person VARCHAR (75) NOT NULL ,
     password_person VARCHAR (64) NOT NULL ,
     type_person CHAR (1) NOT NULL ,
     pathimg_person VARCHAR(100) ,
     codeverification_person VARCHAR (15) ,
     datereg_person TIMESTAMP(3) NOT NULL ,
     dateupdate_person TIMESTAMP(3) NOT NULL ,
     provider_person VARCHAR (20) ,
     id_location VARCHAR (20)
    );

ALTER TABLE persons ADD CONSTRAINT persons_PK PRIMARY KEY (id_person)
     ;


-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE persons_answers
    (
     id_person_answer bigserial NOT NULL ,
     datereg_person_answer TIMESTAMP(3) NOT NULL ,
     results_person_answer VARCHAR (8000) NOT NULL ,
     qualification_person_answer INTEGER ,
     trynumber_person_answer INTEGER NOT NULL ,
     timespent_person_answer INTEGER NOT NULL ,
     persons_id_person BIGINT NOT NULL ,
     answers_id_answer BIGINT NOT NULL
    );

ALTER TABLE persons_answers ADD CONSTRAINT persons_answers_PK PRIMARY KEY (id_person_answer)
     ;


-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE persons_courses
    (
     id_person_course bigserial NOT NULL ,
     datereg_person_course TIMESTAMP(3) NOT NULL ,
     state_person_course CHAR (1) NOT NULL ,
     courses_id_course BIGINT NOT NULL ,
     persons_id_person BIGINT NOT NULL
    );

ALTER TABLE persons_courses ADD CONSTRAINT persons_courses_PK PRIMARY KEY (id_person_course)
     ;


-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE questions
    (
     id_question bigserial NOT NULL ,
     type_question VARCHAR (10) NOT NULL ,
     title_question VARCHAR (200) NOT NULL ,
     description_question VARCHAR (500) NOT NULL ,
     pathurlsign_question VARCHAR (100) ,
     points_question BOOLEAN ,
     maximumpoints_question INTEGER ,
     state_question VARCHAR (1) NOT NULL ,
     "evaluations_id-evaluation" BIGINT NOT NULL
    );

ALTER TABLE questions ADD CONSTRAINT questions_PK PRIMARY KEY (id_question)
     ;


-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE resources
    (
     id_resource bigserial NOT NULL ,
     name_resource VARCHAR (50) NOT NULL ,
     pathfile_resource VARCHAR (100) ,
     pathvideo_resource VARCHAR (200) ,
     pathurlsign_resource VARCHAR (200) ,
     datereg_resource TIMESTAMP(3) ,
     dateupdate_resource TIMESTAMP(3) ,
     state_resource CHAR (1) NOT NULL ,
     levels_id_levels BIGINT NOT NULL
    );

ALTER TABLE resources ADD CONSTRAINT resources_PK PRIMARY KEY (id_resource)
     ;


-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE syllabus
    (
     id_syllabu bigserial NOT NULL ,
     name_syllabu VARCHAR (50) NOT NULL ,
     description_syllabu VARCHAR (100) NOT NULL ,
     keywords_syllabu TEXT ,
     pathimg_syllabus VARCHAR (75) ,
     datereg_syllabu TIMESTAMP(3) NOT NULL ,
     dateupdate_syllabu TIMESTAMP(3) NOT NULL ,
     state_syllabu CHAR (1) NOT NULL ,
     courses_id_course BIGINT NOT NULL
    );

ALTER TABLE syllabus ADD CONSTRAINT syllabus_PK PRIMARY KEY (id_syllabu)
     ;


-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE utils
    (
     key_util VARCHAR (50) NOT NULL ,
     value_util TEXT NOT NULL
    );

ALTER TABLE utils ADD CONSTRAINT utils_PK PRIMARY KEY (key_util)
     ;


ALTER TABLE answers
    ADD CONSTRAINT answers_questions_FK FOREIGN KEY
    (
     questions_id_question
    )
    REFERENCES questions
    (
     id_question
    )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;


ALTER TABLE courses
    ADD CONSTRAINT courses_persons_FK FOREIGN KEY
    (
     persons_id_person
    )
    REFERENCES persons
    (
     id_person
    )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;


ALTER TABLE evaluations
    ADD CONSTRAINT evaluations_levels_FK FOREIGN KEY
    (
     levels_id_levels
    )
    REFERENCES levels
    (
     id_levels
    )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;


ALTER TABLE levels
    ADD CONSTRAINT levels_modules_FK FOREIGN KEY
    (
     modules_id_module
    )
    REFERENCES modules
    (
     id_module
    )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;


ALTER TABLE modules
    ADD CONSTRAINT modules_syllabus_FK FOREIGN KEY
    (
     syllabus_id_syllabu
    )
    REFERENCES syllabus
    (
     id_syllabu
    )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;


ALTER TABLE persons_answers
    ADD CONSTRAINT persons_answers_answers_FK FOREIGN KEY
    (
     answers_id_answer
    )
    REFERENCES answers
    (
     id_answer
    )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;


ALTER TABLE persons_answers
    ADD CONSTRAINT persons_answers_persons_FK FOREIGN KEY
    (
     persons_id_person
    )
    REFERENCES persons
    (
     id_person
    )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;


ALTER TABLE persons_courses
    ADD CONSTRAINT persons_courses_courses_FK FOREIGN KEY
    (
     courses_id_course
    )
    REFERENCES courses
    (
     id_course
    )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;


ALTER TABLE persons_courses
    ADD CONSTRAINT persons_courses_persons_FK FOREIGN KEY
    (
     persons_id_person
    )
    REFERENCES persons
    (
     id_person
    )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;


ALTER TABLE questions
    ADD CONSTRAINT questions_evaluations_FK FOREIGN KEY
    (
     "evaluations_id-evaluation"
    )
    REFERENCES evaluations
    (
     "id-evaluation"
    )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;


ALTER TABLE resources
    ADD CONSTRAINT resources_levels_FK FOREIGN KEY
    (
     levels_id_levels
    )
    REFERENCES levels
    (
     id_levels
    )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;


ALTER TABLE syllabus
    ADD CONSTRAINT syllabus_courses_FK FOREIGN KEY
    (
     courses_id_course
    )
    REFERENCES courses
    (
     id_course
    )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;




-- SQLINES DEMO *** n de Oracle SQL Developer Data Modeler:
--
-- SQLINES DEMO ***                        12
-- SQLINES DEMO ***                         1
-- SQLINES DEMO ***                        24
-- SQLINES DEMO ***                         0
-- SQLINES DEMO ***                         0
-- SQLINES DEMO ***                         0
-- SQLINES DEMO *** DY                      0
-- SQLINES DEMO ***                         0
-- SQLINES DEMO ***                         0
-- SQLINES DEMO ***                         0
-- SQLINES DEMO ***                         0
-- SQLINES DEMO ***                         0
-- SQLINES DEMO ***                         0
-- SQLINES DEMO *** IEW                     0
-- SQLINES DEMO *** EGMENT                  0
-- SQLINES DEMO ***                         0
-- SQLINES DEMO ***                         0
-- SQLINES DEMO ***                         0
-- SQLINES DEMO ***                         0
-- SQLINES DEMO *** FUNCTION                0
-- SQLINES DEMO *** SCHEME                  0
--
-- SQLINES DEMO ***                         0
--
-- SQLINES DEMO ***                         0
-- SQLINES DEMO ***                         0
