# aws-dynamodb-backup

Lambda in nodejs that takes care of the backup of dynamodb tables.

## Scope

To create schedule backup of all dynamo db table on a daily basis. The lambda will search for dynamodb resources that are tagged with a proper tag and will perform a backup of them.

Lately will do a maintenance plan to roll out all backups older than the what is specified in the tag.
