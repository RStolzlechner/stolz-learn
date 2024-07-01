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
            .WithColumn("question").AsString().NotNullable()
            .WithColumn("correct_answer").AsString().NotNullable()
            .WithColumn("date_create").AsDateTimeOffset().NotNullable().WithDefault(SystemMethods.CurrentDateTimeOffset)
            .WithColumn("deleted").AsBoolean().WithDefaultValue(false);

        Create.Table("questionare")
            .WithColumn("id").AsGuid().NotNullable().PrimaryKey().WithDefault(SystemMethods.NewSequentialId)
            .WithColumn("course_id").AsGuid().NotNullable().ForeignKey("course", "id")
            .WithColumn("date_create").AsDateTimeOffset().NotNullable().WithDefault(SystemMethods.CurrentDateTimeOffset);

        Create.Table("answer")
            .WithColumn("question_id").AsGuid().NotNullable().PrimaryKey().ForeignKey("question", "id")
            .WithColumn("questionare_id").AsGuid().NotNullable().PrimaryKey().ForeignKey("questionare", "id")
            .WithColumn("given_answer").AsString().NotNullable()
            .WithColumn("is_correct").AsBoolean().NotNullable();
    }

    public override void Down()
    {
        Delete.Table("answer");
        Delete.Table("questionare");
        Delete.Table("question");
        Delete.Table("course");
    }
}