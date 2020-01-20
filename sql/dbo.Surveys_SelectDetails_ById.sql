USE [C81_ScrubsData]
GO
/****** Object:  StoredProcedure [dbo].[Surveys_SelectDetails_ById]    Script Date: 1/20/2020 11:43:34 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*=============================================
Author:		Spenser Davis
Create date: 11/16/19
Description:	Surveys - Select All Details By Id

Paginated; Joins all Survey Sections, Questions,
and QuestionAnswerOptions to display all aspects
of a particular survey as nested JSON data
=============================================*/

ALTER proc [dbo].[Surveys_SelectDetails_ById]

	@Id int

AS

/* ====================================================

Declare
	@Id int = 3

Execute dbo.Surveys_SelectDetails_ById
	@Id

	select * from Surveys
	select * from SurveyQuestions
	select * from SurveySections

============================================================ */

BEGIN

	SELECT 
		s.[Id] as SurveyId
		,s.[Name] as SurveyName
		,s.[Description] as SurveyDesc
		,s.[StatusId] as SurveyStatusId
		,s.[SurveyTypeId]
		,s.[CreatedBy] as SurveyCreatedBy
		,s.[ModifiedBy] as SurveyModifiedBy
		,s.[DateCreated] as SurveyDateCreated
		,s.[DateModified] as SurveyDateModified
		,(
		SELECT 
			ss.[Id] as SurveySectionId
			,ss.[Title] as SurveySectionTitle
			,ss.[Description] as SurveySectionDesc
			,ss.[SortOrder] as SurveySectionSortOrder
			,ss.[DateCreated] as SurveySectionDateCreated
			,ss.[DateModified] as SurveySectionDateModified
			,(
			SELECT
				sq.[Id] as QuestionId
				,sq.[UserId]
				,sq.[Question]
				,sq.[HelpText]
				,sq.[IsRequired] as IsQuestionRequired
				,sq.[IsMultipleAllowed]
				,sq.[QuestionTypeId]	
				,sq.[StatusId] as QuestionStatusId
				,sq.[SortOrder] as QuestionSortOrder
				,sq.[DateCreated] as QuestionDateCreated
				,sq.[DateModified] as QuestionDateModified
				,(
				SELECT 
					sqao.[Id] as SurvQuestAnsOptionId
					,sqao.[Text] as SurvQuestAnsOptionText
					,sqao.[Value] as SurvQuesAnsOptionVal
					,sqao.[AdditionalInfo] as SurvQAOptionAdditionalInfo
					,sqao.[CreatedBy] as SurvQAOptionCreatedBy
					,sqao.[ModifiedBy] as SurvQAOptionLastModifiedBy
					,sqao.[DateCreated] as SurvQAOptionDateCreated
					,sqao.[DateModified] as SurvQAOptionDateLastModified
				FROM
					dbo.SurveyQuestionAnswerOptions as sqao
					 join dbo.SurveyQuestions as sq2
						on sqao.QuestionId = sq2.Id
						where sq2.Id = sq.Id for json auto
				) as SurveyQuestionAnswerOptions
			FROM
				dbo.SurveyQuestions as sq
				 join dbo.SurveySections as s2
					on sq.SectionId = s2.Id	
					where ss.Id = s2.Id for json auto
			) as SurveyQuestions
		FROM
			dbo.SurveySections as ss
			 join dbo.Surveys as s2
				on ss.SurveyId = s2.Id 
				where s2.Id=s.Id for json auto
		) as SurveySections
	FROM
		[dbo].[Surveys] as s
	WHERE s.[Id] = @Id	
	
END