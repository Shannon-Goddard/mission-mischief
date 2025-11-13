/**
 * AWS Submission Sync - Optional backend integration
 */

const AWSSync = {
  // Sync submissions to existing DynamoDB table
  async syncSubmission(submission) {
    try {
      const response = await fetch('https://4q1ybupwm0.execute-api.us-east-1.amazonaws.com/prod/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'direct_submit',
          ...submission
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ AWS sync successful:', result.submission_id);
        return true;
      }
      return false;
    } catch (error) {
      console.log('⚠️ AWS sync failed, using localStorage only:', error.message);
      return false;
    }
  }
};

// Enhance DirectSubmission to optionally sync with AWS
if (window.DirectSubmission) {
  const originalSubmit = DirectSubmission.submitMission;
  DirectSubmission.submitMission = function(missionId, points, proofUrl) {
    const result = originalSubmit.call(this, missionId, points, proofUrl);
    
    // Optional AWS sync (fails gracefully)
    if (result.success) {
      AWSSync.syncSubmission({
        missionId,
        points,
        proofUrl,
        timestamp: new Date().toISOString(),
        user: Storage.getUser().userHandle
      });
    }
    
    return result;
  };
}

window.AWSSync = AWSSync;