/**
 * AWS Submission Sync - Optional backend integration
 */

const AWSSync = {
  // Sync submissions to existing DynamoDB table
  async syncSubmission(submission) {
    try {
      console.log('🚀 Attempting AWS sync with data:', submission);
      
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
      } else {
        const errorText = await response.text();
        console.log('❌ AWS sync failed with status:', response.status, errorText);
        return false;
      }
    } catch (error) {
      console.log('⚠️ AWS sync failed, using localStorage only:', error.message);
      return false;
    }
  }
};

// Enhance DirectSubmission to optionally sync with AWS
function enhanceDirectSubmission() {
  if (window.DirectSubmission) {
    console.log('🔧 Enhancing DirectSubmission with AWS sync...');
    const originalSubmit = DirectSubmission.submitMission;
    DirectSubmission.submitMission = function(missionId, points, proofUrl) {
      console.log('🚀 DirectSubmission called with:', { missionId, points, proofUrl });
      const result = originalSubmit.call(this, missionId, points, proofUrl);
      
      // Optional AWS sync (fails gracefully)
      if (result.success) {
        const user = Storage.getUser();
        const syncData = {
          missionId,
          points,
          proofUrl,
          timestamp: new Date().toISOString(),
          username: user.userName || user.userHandle || 'Unknown',
          city: user.city || 'Unknown',
          state: user.state || 'Unknown',
          country: user.country || 'USA'
        };
        console.log('📡 Attempting AWS sync with:', syncData);
        AWSSync.syncSubmission(syncData);
      }
      
      return result;
    };
    console.log('✅ DirectSubmission enhanced with AWS sync');
  } else {
    console.log('⚠️ DirectSubmission not found, retrying in 100ms...');
    setTimeout(enhanceDirectSubmission, 100);
  }
}

// Try to enhance immediately and retry if needed
enhanceDirectSubmission();

window.AWSSync = AWSSync;

// Also try enhancement when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhanceDirectSubmission);
} else {
  enhanceDirectSubmission();
}