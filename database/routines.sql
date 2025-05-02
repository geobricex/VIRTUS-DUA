create function evaluation_select(id_parameter_evaluation integer, id_parameter_person integer)
    returns TABLE
            (
                information text
            )
    language plpgsql
as
$$
DECLARE
    --trueorFalse record:= null;
    --simpleOption record:= null;
BEGIN
    BEGIN
        --topic -

        -- SELECT information FROM questions_select(17,1);

        -- select * from evaluations;

        return query select (select COALESCE(array_to_json(array_agg(row_to_json(evaluation_.*))), '[]') as evaluation
                             from (SELECT id_evaluation,
                                          name_evaluation,
                                          description_evaluation,
                                          datereg_evaluation,
                                          dateupdate_evaluation,
                                          time_evaluation,
                                          timeminutes_evaluation,
                                          topics_id_topic,
                                          state_evaluation,
                                          type_evaluation,
                                          opportunity_evaluation,
                                          opportunities_evaluation,
                                          order_category,
                                          allows_review,
                                          sum(eqc.number_question) as numberquestion_evaluation
                                   FROM evaluations
                                            INNER JOIN evaluation_question_category eqc
                                                       on evaluations.id_evaluation = eqc.evaluations_id_evaluation
                                   WHERE topics_id_topic = id_parameter_evaluation
                                     AND state_evaluation = 'A'
                                   GROUP BY id_evaluation
                                   ORDER BY id_evaluation asc) as evaluation_)::text;


    EXCEPTION
        WHEN OTHERS THEN
            raise notice '% %', SQLERRM, SQLSTATE;
            rollback;
    END;
END;
$$;

alter function evaluation_select(integer, integer) owner to postgres;

