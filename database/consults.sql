select * from persons order by id_person;
select * from questions;
-- delete from courses where name_course = 'bronco';
-- delete from persons_courses
-- delete from persons_courses where persons_id_person = 7;

SELECT DISTINCT(id_topic), name_topic, description_topic, keywords_topic, pathimg_topic, datereg_topic, dateupdate_topic, state_topic, syllabus_id_syllabu
, count(e.topics_id_topic) as cantEvaluation
FROM topics
LEFT JOIN  evaluations e on topics.id_topic = e.topics_id_topic
WHERE state_topic = 'A' and syllabus_id_syllabu=1
GROUP BY id_topic
ORDER BY id_topic;

select * from resources order by id_resource desc;


select * from question_category;

select * from topics
--inner join resources r on topics.id_topic = r.topics_id_topic
LEFT JOIN evaluations e on topics.id_topic = e.topics_id_topic
where e.topics_id_topic=1

select * from question_category;

select * from persons;

select * from answers
inner join questions q on answers.questions_id_question = q.id_question
inner join question_category qc on q.question_category_id_questioncategory = qc.id_questioncategory;

select * from persons_courses;


select * from courses;

select * from answers;

select * from evaluations;
select * from evaluation_question_category;
select * from questions;
select * from answers; --where options_answer ilike  '%piece%';
-- FUNCTION: public.home_select(integer, integer)

-- DROP FUNCTION public.home_select(integer, integer);

select * from persons_evaluations;
