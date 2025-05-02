select *
from persons;

select *
from persons_courses;

select *
from courses;

select *
from topics;

select *
from resources;


select *
from syllabus
where courses_id_course = 30;


select *
from questions
    where description_question ilike '%es el monitor%'
    --_category;
         inner join question_category qc on questions.question_category_id_questioncategory = qc.id_questioncategory;
SELECT * FROM answers;
select *
from evaluations
where topics_id_topic = 29;
select * from evaluation_question_category;
select *
from resources
where topics_id_topic = 29;

select *
from answers
where answers.options_answer ilike  '%piece_questionarie%'

   inner join questions q on answers.questions_id_question = q.id_question
    where q.title_question ilike  '%11%';

select *
from courses;
SELECT * FROM questions
         INNER JOIN answers a on questions.id_question = a.questions_id_question
         WHERE id_e =;
select *
from utils;

select *
from settings;

select *
from evaluation_question_category
where evaluations_id_evaluation = 17
ORDER BY question_category_id_questioncategory;

UPDATE evaluation_question_category SET number_question = 0
WHERE evaluations_id_evaluation = 18 AND question_category_id_questioncategory = 7
                                      RETURNING id_evaluation_question_category;

select * from question_category;

select * from persons;
select * from persons_courses;
select * from persons_evaluations;
select * from evaluations order by  id_evaluation desc;
select * from settings;
select * from persons;
select * from questions;
select * from answers;
select * from resources order by id_resource desc;

select infor from evaluations_review_select(5,1, 2)

