using FluentMigrator;
using FluentMigrator.Postgres;

namespace StolzLearn.Core.Migrations;

[Migration(202407011551, "Create initial Tables.")]
public class Migration_202407011551 : Migration
{
    public override void Up()
    {
        Create.Table("course")
            .WithColumn("id").AsGuid().NotNullable().PrimaryKey().WithDefault(SystemMethods.NewSequentialId)
            .WithColumn("number").AsString().NotNullable().Unique()
            .WithColumn("name").AsString().NotNullable()
            .WithColumn("date_create").AsDateTimeOffset().NotNullable().WithDefault(SystemMethods.CurrentDateTimeOffset)
            .WithColumn("in_archive").AsBoolean().WithDefaultValue(false);

        Create.Table("question")
            .WithColumn("id").AsGuid().NotNullable().PrimaryKey().WithDefault(SystemMethods.NewSequentialId)
            .WithColumn("course_id").AsGuid().NotNullable().ForeignKey("course", "id")
            .WithColumn("number").AsInt32().NotNullable().Identity()
            .WithColumn("question_text").AsString().NotNullable()
            .WithColumn("correct_answer").AsString().NotNullable()
            .WithColumn("date_create").AsDateTimeOffset().NotNullable().WithDefault(SystemMethods.CurrentDateTimeOffset)
            .WithColumn("deleted").AsBoolean().WithDefaultValue(false);

        Create.Table("questionnaire")
            .WithColumn("id").AsGuid().NotNullable().PrimaryKey().WithDefault(SystemMethods.NewSequentialId)
            .WithColumn("course_id").AsGuid().NotNullable().ForeignKey("course", "id")
            .WithColumn("date_create").AsDateTimeOffset().NotNullable().WithDefault(SystemMethods.CurrentDateTimeOffset);

        Create.Table("answer")
            .WithColumn("id").AsGuid().NotNullable().PrimaryKey().WithDefault(SystemMethods.NewSequentialId)
            .WithColumn("question_id").AsGuid().NotNullable().ForeignKey("question", "id")
            .WithColumn("questionnaire_id").AsGuid().NotNullable().ForeignKey("questionnaire", "id")
            .WithColumn("given_answer").AsString().NotNullable()
            .WithColumn("is_correct").AsBoolean().NotNullable()
            .WithColumn("date_create").AsDateTimeOffset().NotNullable().WithDefault(SystemMethods.CurrentDateTimeOffset);
    }

    public override void Down()
    {
        Delete.Table("answer");
        Delete.Table("questionare");
        Delete.Table("question");
        Delete.Table("course");
    }
}